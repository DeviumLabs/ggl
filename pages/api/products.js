export default function handler(req, res) {
  const category = req.query.category;
  const product = req.query.product;

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET");

  catalogs.map((c) => {
    if (c.slug === category) {
      c.products.map((p) => {
        if (p.slug === product) {
          res.setHeader("Access-Control-Allow-Origin", "*");
          res.setHeader(
            "Access-Control-Allow-Headers",
            "Origin, X-Requested-With, Content-Type, Accept, Authorization"
          );
          res.setHeader("Access-Control-Allow-Methods", "GET");
          res.status(200).json(p);
        }
      });
    }
  });

  if (category == "all") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.status(200).json(catalogs);
  }

  res.status(200).json({ error: "Product not found" });
}

const catalogs = [
  {
    title: "Armários",
    slug: "armarios",
    image: "",
    description: "",
    products: [
      {
        name: "A402",
        slug: "a402",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "7000 mm",
          width: "2000 mm",
          depth: "5000 mm",
        },
        images: ["/assets/products/cabinets/a402_1.jpeg"],
      },
    ],
  },
  {
    title: "Arquivos",
    slug: "arquivos",
    products: [
      {
        name: "A-R4",
        slug: "a-r4",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "1340 mm",
          width: "470 mm",
          depth: "710 mm",
        },
        images: ["/assets/products/files/ar4.jpeg"],
      },
    ],
  },
  {
    title: "Deslizantes",
    slug: "deslizantes",
    products: [
      {
        name: "Deslizante Inicial",
        slug: "deslizante-inicial",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "2250 mm",
          width: "1050 mm",
          depth: "860 mm",
        },
        images: ["/assets/products/sliders/deslizante.jpeg"],
      },
    ],
  },
  {
    title: "Estantes",
    slug: "estantes",
    products: [
      {
        name: "EDE",
        slug: "ede",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "2000 mm",
          width: "1000 mm",
          depth: "500 mm",
        },
        images: ["/assets/products/shelves/estante.jpeg"],
      },
    ],
  },
  {
    title: "Gondolas",
    slug: "gondolas",
    products: [
      {
        name: "Balcão",
        slug: "balcao",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "1000 mm",
          width: "920 mm",
          depth: "400 mm",
        },
        images: ["/assets/products/gondolas/balcao.jpeg"],
      },
    ],
  },
  {
    title: "Armários Vestiários",
    slug: "armarios-vestiarios",
    products: [
      {
        name: "GAL",
        slug: "gal",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        scale: {
          height: "0 mm",
          width: "0 mm",
          depth: "0 mm",
        },
        images: ["/assets/products/locker-rooms/roupeiro.jpeg"],
      },
    ],
  },
];
