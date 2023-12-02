import camelCase from 'lodash/camelCase';
const files: any = import.meta.glob('./*.ts', { eager: true });

const modules: any = {};
for (const key in files) {
  if (key === './index.ts') continue;
  modules[camelCase(key.replace(/(\.\/|\.ts)/g, ''))] = files[key].default;
}

export default modules;
