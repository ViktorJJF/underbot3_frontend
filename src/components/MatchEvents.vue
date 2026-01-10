<template>
  <div class="match-events">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <el-icon class="is-loading"><Loading /></el-icon>
      <span>Cargando eventos...</span>
    </div>

    <template v-else>
      <!-- Summary Stats Row -->
      <div class="stats-row mb-3">
        <!-- Total Fouls Card -->
        <div class="stat-card foul-card">
          <div class="stat-header">
            <span class="stat-icon">⚠️</span>
            <span class="stat-label">Total Faltas del Partido</span>
          </div>
          <div class="stat-value">{{ totalFouls }}</div>
          <div class="stat-breakdown">
            <div class="team-foul-row">
              <span class="team-indicator home"></span>
              <span class="home-stat" :class="{ 'danger': homeFouls >= 4 }">
                {{ homeTeamName }}: <strong>{{ homeFouls }}</strong>
              </span>
            </div>
            <div class="team-foul-row">
              <span class="team-indicator away"></span>
              <span class="away-stat" :class="{ 'danger': awayFouls >= 4 }">
                {{ awayTeamName }}: <strong>{{ awayFouls }}</strong>
              </span>
            </div>
          </div>
        </div>

        <!-- Total Events Card -->
        <div class="stat-card events-card">
          <div class="stat-header">
            <span class="stat-icon">📊</span>
            <span class="stat-label">Total Eventos</span>
          </div>
          <div class="stat-value">{{ events.length }}</div>
          <div class="stat-breakdown">
            <span class="event-types-count">{{ eventTypesWithCount.length }} tipos de eventos</span>
          </div>
        </div>
      </div>

      <!-- Foul Details by Period -->
      <div v-if="showFoulStats && foulsByPeriod.length > 0" class="foul-details-card mb-3">
        <h6 class="section-title">Faltas por Cuarto</h6>
        <div class="period-grid">
          <div v-for="period in foulsByPeriod" :key="period.period" class="period-item">
            <span class="period-name">Q{{ period.period }}</span>
            <div class="period-stats">
              <span class="home-period">{{ period.home }}</span>
              <span class="period-sep">-</span>
              <span class="away-period">{{ period.away }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Type Filters -->
      <div class="event-filters mb-3">
        <h6 class="section-title">Filtrar por tipo de evento ({{ eventTypesWithCount.length }} tipos)</h6>
        <div class="filter-tags">
          <el-tag
            size="large"
            :type="selectedEventType === '' ? 'primary' : 'info'"
            :effect="selectedEventType === '' ? 'dark' : 'plain'"
            class="filter-tag"
            @click="selectEventType('')"
          >
            Todos ({{ events.length }})
          </el-tag>
          <el-tag
            v-for="eventType in eventTypesWithCount"
            :key="eventType.type"
            size="large"
            :type="selectedEventType === eventType.type ? 'primary' : 'info'"
            :effect="selectedEventType === eventType.type ? 'dark' : 'plain'"
            class="filter-tag"
            @click="selectEventType(eventType.type)"
          >
            {{ getEventIcon(eventType.type) }} {{ getEventTypeName(eventType.type) }} ({{ eventType.count }})
          </el-tag>
        </div>
      </div>
      <!-- Events Timeline -->
      <div class="events-timeline">
      <div class="timeline-header">
        <h6 class="section-title">
          Eventos en vivo
          <span v-if="selectedEventType" class="filter-indicator">
            - Filtrado: {{ getEventTypeName(selectedEventType) }}
          </span>
        </h6>
        <el-button
          v-if="selectedEventType"
          size="small"
          type="warning"
          plain
          @click="selectEventType('')"
        >
          Limpiar filtro
        </el-button>
      </div>

      <div v-if="filteredEvents.length === 0" class="no-events">
        <span>{{ events.length === 0 ? 'Sin eventos aun' : 'No hay eventos de este tipo' }}</span>
      </div>
      <div v-else class="events-list">
        <div
          v-for="event in displayedEvents"
          :key="event.eventId"
          class="event-item"
          :class="[`event-${event.type}`, `team-${event.team}`]"
        >
          <div class="event-time">
            <span class="period">Q{{ event.period }}</span>
            <span class="seconds">{{ formatTime(event.seconds) }}</span>
          </div>
          <div class="event-content">
            <span class="event-icon">{{ getEventIcon(event.type) }}</span>
            <span class="event-description">{{ getEventDescription(event) }}</span>
          </div>
          <div class="event-team-indicator" :class="event.team"></div>
        </div>
      </div>
      <div v-if="filteredEvents.length > maxDisplayEvents" class="show-more">
        <el-button size="small" text @click="toggleShowAll">
          {{ showAllEvents ? 'Mostrar menos' : `Ver todos (${filteredEvents.length})` }}
        </el-button>
      </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Loading } from '@element-plus/icons-vue';
import { subscribeToMatchEvents, unsubscribeFromMatchEvents } from '@/plugins/sockets';
import MatchEventsService from '@/services/api/matchEvents';

interface MatchEvent {
  eventId: number;
  type: string;
  team: string;
  period: number;
  seconds: number;
  points?: number;
  player?: { name: string; position?: string };
  scorer?: { name: string };
  fouling?: { name: string };
  fouled?: { name: string };
  reason?: string;
  result?: { home: number; away: number };
}

const props = defineProps({
  matchId: {
    type: String,
    required: true,
  },
  homeTeamName: {
    type: String,
    default: 'Home',
  },
  awayTeamName: {
    type: String,
    default: 'Away',
  },
  showFoulStats: {
    type: Boolean,
    default: true,
  },
  initialEvents: {
    type: Array as () => MatchEvent[],
    default: () => [],
  },
  initialFoulStats: {
    type: Object as () => { home: number; away: number },
    default: () => ({ home: 0, away: 0 }),
  },
});

const events = ref<MatchEvent[]>([...props.initialEvents]);
const foulStats = ref(props.initialFoulStats);
const showAllEvents = ref(false);
const selectedEventType = ref<string>('');
const maxDisplayEvents = 15;
const isLoading = ref(false);
const foulStatsFromApi = ref<any>(null);

// Computed properties
const homeFouls = computed(() => {
  // Prefer API stats, then calculate from events, then use props
  if (foulStatsFromApi.value?.summary?.home !== undefined) {
    return foulStatsFromApi.value.summary.home;
  }
  const foulEvents = events.value.filter(e => e.type === 'foul' && e.team === 'home');
  return foulEvents.length || foulStats.value.home;
});

const awayFouls = computed(() => {
  // Prefer API stats, then calculate from events, then use props
  if (foulStatsFromApi.value?.summary?.away !== undefined) {
    return foulStatsFromApi.value.summary.away;
  }
  const foulEvents = events.value.filter(e => e.type === 'foul' && e.team === 'away');
  return foulEvents.length || foulStats.value.away;
});

const totalFouls = computed(() => {
  if (foulStatsFromApi.value?.summary?.total !== undefined) {
    return foulStatsFromApi.value.summary.total;
  }
  return homeFouls.value + awayFouls.value;
});

const foulsByPeriod = computed(() => {
  const foulEvents = events.value.filter(e => e.type === 'foul');
  const periods: { [key: number]: { home: number; away: number } } = {};

  for (const foul of foulEvents) {
    if (!periods[foul.period]) {
      periods[foul.period] = { home: 0, away: 0 };
    }
    if (foul.team === 'home') {
      periods[foul.period].home++;
    } else if (foul.team === 'away') {
      periods[foul.period].away++;
    }
  }

  return Object.entries(periods)
    .map(([period, counts]) => ({
      period: parseInt(period),
      ...counts,
    }))
    .sort((a, b) => a.period - b.period);
});

// Get distinct event types with counts
const eventTypesWithCount = computed(() => {
  const typeCounts: { [key: string]: number } = {};

  for (const event of events.value) {
    if (!typeCounts[event.type]) {
      typeCounts[event.type] = 0;
    }
    typeCounts[event.type]++;
  }

  return Object.entries(typeCounts)
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count);
});

// Filtered events based on selected type
const filteredEvents = computed(() => {
  if (!selectedEventType.value) {
    return events.value;
  }
  return events.value.filter(e => e.type === selectedEventType.value);
});

const displayedEvents = computed(() => {
  const sorted = [...filteredEvents.value].sort((a, b) => b.seconds - a.seconds);
  if (showAllEvents.value) {
    return sorted;
  }
  return sorted.slice(0, maxDisplayEvents);
});

// Methods
function selectEventType(type: string): void {
  selectedEventType.value = type;
  showAllEvents.value = false;
}

function formatTime(seconds: number): string {
  const periodSeconds = seconds % 720;
  const minutes = Math.floor((720 - periodSeconds) / 60);
  const secs = (720 - periodSeconds) % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

function getEventIcon(type: string): string {
  const icons: { [key: string]: string } = {
    score: '🏀',
    foul: '⚠️',
    freethrow: '🎯',
    freethrow_missed: '❌',
    rebound: '💪',
    turnover: '🔄',
    steal: '👌',
    timeout: '⏸️',
    substitution: '🔃',
    period_start: '▶️',
    period_end: '⏹️',
    attempt_missed: '❌',
    attempt_blocked: '🚫',
  };
  return icons[type] || '•';
}

function getEventTypeName(type: string): string {
  const names: { [key: string]: string } = {
    score: 'Anotación',
    foul: 'Falta',
    freethrow: 'Tiro libre',
    freethrow_missed: 'TL fallado',
    rebound: 'Rebote',
    turnover: 'Pérdida',
    steal: 'Robo',
    timeout: 'Tiempo muerto',
    substitution: 'Cambio',
    period_start: 'Inicio período',
    period_end: 'Fin período',
    attempt_missed: 'Tiro fallado',
    attempt_blocked: 'Bloqueo',
  };
  return names[type] || type;
}

function getEventDescription(event: MatchEvent): string {
  const team = event.team === 'home' ? props.homeTeamName : props.awayTeamName;

  switch (event.type) {
    case 'score':
      const scorer = event.scorer?.name || event.player?.name || 'Unknown';
      const points = event.points || 2;
      const result = event.result ? ` (${event.result.home}-${event.result.away})` : '';
      return `${points}pts - ${scorer}${result}`;
    case 'foul':
      const fouler = event.fouling?.name || event.player?.name || 'Unknown';
      const reason = event.reason ? ` (${event.reason})` : '';
      return `Falta: ${fouler}${reason}`;
    case 'freethrow':
      return `Tiro libre anotado - ${event.player?.name || 'Unknown'}`;
    case 'freethrow_missed':
      return `Tiro libre fallado - ${event.player?.name || 'Unknown'}`;
    case 'rebound':
      return `Rebote - ${event.player?.name || 'Unknown'}`;
    case 'turnover':
      return `Perdida - ${event.player?.name || 'Unknown'}`;
    case 'steal':
      return `Robo - ${event.player?.name || 'Unknown'}`;
    case 'timeout':
      return `Tiempo muerto - ${team}`;
    case 'substitution':
      return `Cambio - ${team}`;
    case 'period_start':
      return `Inicio Q${event.period}`;
    case 'period_end':
      return `Fin Q${event.period}`;
    case 'attempt_missed':
      return `Tiro fallado - ${event.player?.name || 'Unknown'}`;
    case 'attempt_blocked':
      return `Tiro bloqueado - ${event.player?.name || 'Unknown'}`;
    default:
      return event.type;
  }
}

function toggleShowAll(): void {
  showAllEvents.value = !showAllEvents.value;
}

async function loadInitialEvents(): Promise<void> {
  isLoading.value = true;
  try {
    // Load events and foul stats in parallel
    const [eventsResponse, foulStatsResponse] = await Promise.all([
      MatchEventsService.getByMatch(props.matchId, { limit: 200 }),
      MatchEventsService.getFoulStats(props.matchId),
    ]);

    if (eventsResponse.data?.payload) {
      events.value = eventsResponse.data.payload;
    }

    if (foulStatsResponse.data?.payload) {
      foulStatsFromApi.value = foulStatsResponse.data.payload;
    }
  } catch (error) {
    console.error('Error loading match events:', error);
  } finally {
    isLoading.value = false;
  }
}

// Watch for prop changes
watch(() => props.initialEvents, (newEvents) => {
  if (newEvents && newEvents.length > 0) {
    for (const event of newEvents) {
      const exists = events.value.some(e => e.eventId === event.eventId);
      if (!exists) {
        events.value.push(event);
      }
    }
    events.value.sort((a, b) => a.seconds - b.seconds);
  }
}, { deep: true });

watch(() => props.initialFoulStats, (newStats) => {
  if (newStats) {
    foulStats.value = newStats;
  }
}, { deep: true });

// Lifecycle
onMounted(() => {
  subscribeToMatchEvents(props.matchId);
  // Always load events from API to get complete data and foul stats
  loadInitialEvents();
});

onUnmounted(() => {
  unsubscribeFromMatchEvents(props.matchId);
});
</script>

<style lang="scss" scoped>
.match-events {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #666;
  gap: 12px;

  .el-icon {
    font-size: 32px;
    color: #409eff;
  }
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
}

/* Stats Row */
.stats-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  flex: 1;
  min-width: 140px;
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.stat-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.stat-icon {
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-breakdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #666;
}

.team-foul-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.team-indicator {
  width: 12px;
  height: 12px;
  border-radius: 3px;

  &.home {
    background: #3498db;
  }

  &.away {
    background: #e74c3c;
  }
}

.event-types-count {
  color: #999;
  font-size: 11px;
}

.home-stat,
.away-stat {
  &.danger {
    color: #e74c3c;
    font-weight: 600;
  }
}

.foul-card {
  border-left: 4px solid #f39c12;
}

.events-card {
  border-left: 4px solid #3498db;
}

/* Foul Details */
.foul-details-card {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.period-grid {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.period-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
}

.period-name {
  font-size: 11px;
  color: #999;
  font-weight: 600;
  margin-bottom: 4px;
}

.period-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  font-weight: 600;
}

.home-period {
  color: #3498db;
}

.away-period {
  color: #e74c3c;
}

.period-sep {
  color: #999;
}

/* Event Filters */
.event-filters {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
}

/* Events Timeline */
.events-timeline {
  background: white;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.filter-indicator {
  font-size: 12px;
  color: #666;
  font-weight: 400;
}

.no-events {
  text-align: center;
  padding: 24px;
  color: #999;
  font-size: 13px;
}

.events-list {
  max-height: 400px;
  overflow-y: auto;
}

.event-item {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 6px;
  background: #fafafa;
  border-left: 3px solid transparent;
  transition: background-color 0.15s ease;

  &:hover {
    background: #f0f0f0;
  }

  &.team-home {
    border-left-color: #3498db;
  }

  &.team-away {
    border-left-color: #e74c3c;
  }

  &.event-score {
    background: #e8f5e9;
    &:hover { background: #c8e6c9; }
  }

  &.event-foul {
    background: #fff3e0;
    &:hover { background: #ffe0b2; }
  }
}

.event-time {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;
  margin-right: 12px;
}

.event-time .period {
  font-size: 10px;
  font-weight: 600;
  color: #666;
}

.event-time .seconds {
  font-size: 12px;
  color: #333;
  font-weight: 500;
}

.event-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.event-icon {
  font-size: 16px;
}

.event-description {
  font-size: 13px;
  color: #333;
}

.event-team-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-left: 8px;

  &.home {
    background: #3498db;
  }

  &.away {
    background: #e74c3c;
  }
}

.show-more {
  text-align: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

/* Responsive */
@media (max-width: 480px) {
  .stats-row {
    flex-direction: column;
  }

  .stat-card {
    min-width: 100%;
  }

  .stat-value {
    font-size: 28px;
  }

  .filter-tags {
    gap: 6px;
  }

  .filter-tag {
    font-size: 12px;
  }
}
</style>
