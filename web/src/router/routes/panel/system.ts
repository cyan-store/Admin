import LogsView from "@/views/panel/system/LogsView.vue";
import SystemView from "@/views/panel/system/SystemView.vue";

export default [
    {
        path: "",
        name: "system_settings",
        component: SystemView,
        meta: { title: "System Settings" },
    },

    {
        path: "logs",
        name: "system_logs",
        component: LogsView,
        meta: { title: "System Logs" },
    },
];
