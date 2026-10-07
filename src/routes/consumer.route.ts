const prefix = "/consumer";

export const consumerRoutes = [
    {
        title: "Bookings",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
            },
            {
                title: "My Complaints",
                url: `${prefix}/complaints`,
            },
            {
                title: "My Payments",
                url: `${prefix}/payments`,
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
