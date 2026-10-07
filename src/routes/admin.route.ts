const prefix = "/admin";

export const adminRoutes = [
    {
        title: "Management",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
            },
            {
                title: "Areas",
                url: `${prefix}/areas`,
            },
            {
                title: "AI Assistant",
                url: `${prefix}/ai`,
            },
        ],
    },
    {
        title: "App Settings",
        items: [
            {
                title: "Routing",
                url: "#",
            },
            {
                title: "Data Fetching",
                url: "#",
            },
        ],
    },
];
