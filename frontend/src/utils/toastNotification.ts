import { useToast } from "vue-toast-notification";

export const useToastNotification = () => {
    const toast = useToast();

    return {
        success: (message:string) => toast.success(message, {duration: 3000}),
        error: (message:string) => toast.error(message, {duration: 3000}),
        info: (message:string) => toast.info(message, {duration: 3000}),
        warning: (message:string) => toast.warning(message, {duration: 3000}),
    };
};
