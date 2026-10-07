const prefix = "/operator";

export const operatorRoutes = [
    {
        title: "Schedule",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
            },
            {
                title: "Create Schedule",
                url: `${prefix}/schedules`,
            },
        ],
    },
    {
        title: "Complaints",
        items: [
            {
                title: "All Complaints",
                url: `${prefix}/complaints`,
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
                isActive: true,
            },
        ],
    },
];
