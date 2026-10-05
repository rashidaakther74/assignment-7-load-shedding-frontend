const prefix = "/dashboard";

export const consumerRoutes = [
    {
        title: "Bookings",
        items: [
            {
                title: "Overview",
                url: `${prefix}`,
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
