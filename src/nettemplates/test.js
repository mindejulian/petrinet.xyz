const DemoNet = {
    places: [
        {
            title: "Place 1",
            x: 200,
            y: 100,
            tokens: 0,
            guid: "a243d80f-3fbe-4ca5-8839-6000d833f9df",
            selected: false
        },
        {
            title: "Place 2",
            x: 500,
            y: 100,
            tokens: 20,
            guid: "4323f3ef-ed1d-48bd-a33e-de921bfb375c",
            selected: false
        },
        {
            title: "Place 3",
            x: 800,
            y: 100,
            tokens: 0,
            guid: "83e0d3be-95d5-49ef-94ec-ad0c215f4f06",
            selected: false
        }
    ],
    transitions: [
        {
            title: "Start",
            x: 50,
            y: 75,
            guid: "ecadbfec-baf9-4ae2-b726-57a30af713a4",
            from: [],
            to: [
                "a243d80f-3fbe-4ca5-8839-6000d833f9df", 
                "4323f3ef-ed1d-48bd-a33e-de921bfb375c"
            ]
        },
        {
            title: "Transition 1",
            x: 350,
            y: 75,
            guid: "bc72f1ba-6c3b-47c5-8ca2-833e709cb95c",
            from: ["a243d80f-3fbe-4ca5-8839-6000d833f9df"],
            to: ["4323f3ef-ed1d-48bd-a33e-de921bfb375c"]
        },
        {
            title: "Transition 2",
            x: 650,
            y: 75,
            guid: "51852091-57cf-47d0-9e78-3bb798ed0511",
            from: ["4323f3ef-ed1d-48bd-a33e-de921bfb375c"],
            to: ["83e0d3be-95d5-49ef-94ec-ad0c215f4f06"]
        },
        {
            title: "End",
            x: 950,
            y: 75,
            guid: "43118517-fda9-444d-9559-8f3ecc0732c6",
            from: ["83e0d3be-95d5-49ef-94ec-ad0c215f4f06"],
            to: []
        }
    ]
};

export default DemoNet;

