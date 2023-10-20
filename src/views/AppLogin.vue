<template>
  <div class="login-area">
    <!-- Preloader Start -->

    <!-- Preloader End -->

    <!-- ======================================
 ******* Page Wrapper Area Start **********
 ======================================= -->
    <div class="main-content- h-100vh">
      <div class="container h-100">
        <div class="row h-100 align-items-center justify-content-center">
          <div class="col-md-8 col-lg-5">
            <!-- Middle Box -->
            <div class="middle-box">
              <div class="card">
                <div class="card-body p-4">
                  <!-- Logo -->
                  <h4 class="font-24 mb-1">Login.</h4>

                  <div>
                    <div class="form-group">
                      <label class="float-left" for="emailaddress">Email</label>
                      <input
                        class="form-control"
                        type="email"
                        id="emailaddress"
                        v-model="user.email"
                        requiredplaceholder="Enter your email"
                      />
                    </div>

                    <div class="form-group">
                      <a
                        href="forget-password.html"
                        class="text-dark float-right"
                      ></a>
                      <label class="float-left" for="password">Password</label>
                      <input
                        @keyup.enter="login"
                        v-model="user.password"
                        class="form-control"
                        type="password"
                        requiredid="password"
                        placeholder="Enter your password"
                      />
                    </div>

                    <div class="form-group mb-0">
                      <button
                        class="btn btn-primary btn-block"
                        type="submit"
                        @click="login"
                      >
                        Log In
                      </button>
                    </div>
                  </div>

                  <!-- end card -->
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// plugins
const $store = useStore();
const $router = useRouter();

const loading = ref<boolean>(false);
const user = ref<{ email: string; password: string }>({
  email: '',
  password: '',
});

onMounted(() => {
  if ($store.state.authModule.isTokenSet) {
    $router.push({ name: 'dashboard' });
  }
});

function login() {
  // this.loading = true;
  $store
    .dispatch('authModule/login', user.value)
    .then(() => {
      $router.push({ name: 'dashboard' });
    })
    .catch((error) => {
      console.log('error en login: ', error);
    })
    .finally(() => (loading.value = false));
}

function test() {
  console.log('aaea');
}
</script>

<style scoped></style>
