import { defineNuxtPlugin } from "#app";
import Toast, { type PluginOptions, useToast } from "vue-toastification";
import "vue-toastification/dist/index.css";

export default defineNuxtPlugin((nuxtApp) => {
  const options: PluginOptions = {
    timeout: 3000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    transition: "Vue-Toastification__fade",
    maxToasts: 5,
    newestOnTop: true,
  };

  nuxtApp.vueApp.use(Toast, options);

  return {
    provide: {
      toast: (() => {
        const toast = useToast();
        return {
          success: (message: string, options?: Partial<PluginOptions>) => {
            toast.success(message, options);
          },
          error: (message: string, options?: Partial<PluginOptions>) => {
            toast.error(message, options);
          },
          info: (message: string, options?: Partial<PluginOptions>) => {
            toast.info(message, options);
          },
          warning: (message: string, options?: Partial<PluginOptions>) => {
            toast.warning(message, options);
          },
        };
      })(),
    },
  };
});
