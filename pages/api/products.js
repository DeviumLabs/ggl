export default function handler(req, res) {
  const category = req.query.category;
  const product = req.query.product;

  let response = { error: "Product not found" };

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
          response = p;
        }
      });
    }
  });

  if (category == "all") {
    return res.status(200).json(catalogs);
  } else {
    return res.status(200).json(response);
  }
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
        models: [
          {
            name: "A402",
            scale: {
              height: "1998 mm",
              width: "900 mm",
              depth: "400 mm",
            },
          },
          {
            name: "A403",
            scale: {
              height: "1998 mm",
              width: "1200 mm",
              depth: "450 mm",
            },
          },
          {
            name: "A407",
            scale: {
              height: "1975 mm",
              width: "750 mm",
              depth: "330 mm",
            },
          },
          {
            name: "AZ",
            scale: {
              height: "1998 mm",
              width: "1200 mm",
              depth: "400 mm",
            },
          },
        ],
        images: ["/assets/products/cabinets/a402_1.jpeg"],
      },
      {
        name: "Armário para celular",
        slug: "armario-para-celular",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "Sem carregador",
            scale: {
              height: "1000 mm",
              width: "800 mm",
              depth: "200 mm",
            },
          },
          {
            name: "Com carregador",
            scale: {
              height: "1360 mm",
              width: "350 mm",
              depth: "300 mm",
            },
          },
        ],
        images: [
          "/assets/products/cabinets/porta_celular.jpeg",
          "/assets/products/cabinets/celular.jpg",
          "/assets/products/cabinets/celular2.jpg",
        ],
      },
      {
        name: "Armário Professor",
        slug: "professor",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "Professor",
            scale: {
              height: "1980 mm",
              width: "900 mm",
              depth: "400 mm",
            },
          },
        ],
        images: ["/assets/products/cabinets/professor.jpeg"],
      },
      {
        name: "Carrinho Notebook",
        slug: "notebook",
        description: "Carrinho para notebook com capacidade para 32 notebooks",
        models: [
          {
            name: "Carrinho Notebook",
            scale: {
              height: "1100 mm",
              width: "910 mm",
              depth: "470 mm",
            },
          },
        ],
        images: [
          "/assets/products/cabinets/notebook.jpg",
          "/assets/products/cabinets/notebook2.jpg",
        ],
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
        models: [
          {
            name: "A-R4",
            scale: {
              height: "1340 mm",
              width: "470 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/ar4.jpeg"],
      },
      {
        name: "GAM-5",
        slug: "gam-5",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "GAM-5",
            scale: {
              height: "1340 mm",
              width: "490 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/gam-5.jpeg"],
      },
      {
        name: "GAM-6",
        slug: "gam-6",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "GAM-6",
            scale: {
              height: "1340 mm",
              width: "560 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/gam-6.jpeg"],
      },
      {
        name: "GAM-7",
        slug: "gam-7",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "GAM-7",
            scale: {
              height: "1340 mm",
              width: "490 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/gam-7.jpeg"],
      },
      {
        name: "GAM-8",
        slug: "gam-8",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "GAM-8",
            scale: {
              height: "1340 mm",
              width: "400 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/gam-8.jpeg"],
      },
      {
        name: "GAM-10",
        slug: "gam-10",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "GAM-10",
            scale: {
              height: "1340 mm",
              width: "560 mm",
              depth: "710 mm",
            },
          },
        ],
        images: ["/assets/products/files/gam-10.jpeg"],
      },
      {
        name: "Arquivos Mapoteca",
        slug: "mapoteca",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "Arquivos Mapoteca",
            scale: {
              height: "750 mm",
              width: "1000 mm",
              depth: "800 mm",
            },
          },
        ],
        images: ["/assets/products/files/mapoteca.jpeg"],
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

        models: [
          {
            name: "Simples Face",
            scale: {
              height: "2250 mm",
              width: "1050 mm",
              depth: "430 mm",
            },
          },
          {
            name: "Dupla Face",
            scale: {
              height: "2250 mm",
              width: "1050 mm",
              depth: "860 mm",
            },
          },
        ],
        images: [
          "/assets/products/sliders/deslizante.jpeg",
          "/assets/products/sliders/deslizante-2.jpeg",
        ],
      },
    ],
  },
  {
    title: "Estantes Convencionais",
    slug: "estantes",
    category: "estantes-convencionais",
    products: [
      {
        name: "Modelos PR",
        slug: "pr",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "PR-30",
            scale: {
              height: "1980 mm",
              width: "920 mm",
              depth: "300 mm",
            },
          },
          {
            name: "PR-42",
            scale: {
              height: "1980 mm",
              width: "920 mm",
              depth: "420 mm",
            },
          },
          {
            name: "PR-60",
            scale: {
              height: "1980 mm",
              width: "920 mm",
              depth: "600 mm",
            },
          },
        ],
        images: ["/assets/products/shelves/pr30.jpeg"],
      },
    ],
  },
  {
    title: "Estantes Armazenagem",
    slug: "estantes",
    category: "estantes-armazenagem",
    products: [
      {
        name: "Modelos Armazenagem",
        slug: "encaixe",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "Estante Encaixe",
            scale: {
              height: "2000 mm",
              width: "1600 mm",
              depth: "550 mm",
            },
          },
          {
            name: "Estante Encaixe",
            scale: {
              height: "1980 mm",
              width: "910 mm",
              depth: "550 mm",
            },
          },
        ],
        images: ["/assets/products/shelves/encaixe.jpeg"],
      },
    ],
  },
  {
    title: "Biblioteca Encaixe",
    slug: "estantes",
    category: "biblioteca-encaixe",
    products: [
      {
        name: "Linha EDE",
        slug: "linha-ede",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",

        models: [
          {
            name: "EDE",
            scale: {
              height: "2000 mm",
              width: "1600 mm",
              depth: "550 mm",
            },
          },
          {
            name: "ESE",
            scale: {
              height: "1980 mm",
              width: "910 mm",
              depth: "550 mm",
            },
          },
          {
            name: "ERE",
            scale: {
              height: "1980 mm",
              width: "910 mm",
              depth: "550 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/ere.jpeg",
          "/assets/products/shelves/ese.jpeg",
          "/assets/products/shelves/ere.jpeg",
        ],
      },
      {
        name: "Linha Estantes",
        slug: "linha-estantes",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",
        models: [
          {
            name: "Estante Livro",
            scale: {
              height: "2000 mm",
              width: "1600 mm",
              depth: "550 mm",
            },
          },
          {
            name: "Estante Prateleira",
            scale: {
              height: "1980 mm",
              width: "910 mm",
              depth: "550 mm",
            },
          },
          {
            name: "Estante Gaveta",
            scale: {
              height: "1980 mm",
              width: "910 mm",
              depth: "550 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/estante_livro.jpeg",
          "/assets/products/shelves/estante_prateleira.jpeg",
          "/assets/products/shelves/estante_gaveta.jpeg",
        ],
      },
      {
        name: "Estantes Infantis",
        slug: "linha-infantil",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",
        models: [
          {
            name: "Estante Infantil",
            scale: {
              height: "1200 mm",
              width: "1000 mm",
              depth: "300 mm",
            },
          },
        ],
        images: ["/assets/products/shelves/estante_baixa.jpeg"],
      },
    ],
  },
  {
    title: "Biblioteca Encaixe Coluna",
    slug: "estantes",
    category: "encaixe-coluna",
    products: [
      {
        name: "Linha PR",
        slug: "linha-pr",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",

        models: [
          {
            name: "ED 10 PR",
            scale: {
              height: "1980 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
          {
            name: "ES 6 PR",
            scale: {
              height: "1980 mm",
              width: "1000 mm",
              depth: "320 mm",
            },
          },
          {
            name: "ER 6 PR",
            scale: {
              height: "1980 mm",
              width: "1000 mm",
              depth: "420 mm",
            },
          },
        ],
        images: ["/assets/products/shelves/ed10.jpeg"],
      },
    ],
  },
  {
    title: "Gondolas",
    slug: "gondolas",
    products: [
      {
        name: "Centro",
        slug: "centro",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "Centro",
            scale: {
              height: "1700 mm",
              width: "1115 mm",
              depth: "800 mm",
            },
          },
        ],

        images: ["/assets/products/gondolas/centro.jpeg"],
      },
      {
        name: "Parede",
        slug: "parede",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",
        models: [
          {
            name: "Parede",
            scale: {
              height: "1700 mm",
              width: "1115 mm",
              depth: "400 mm",
            },
          },
        ],

        images: ["/assets/products/gondolas/parede.jpeg"],
      },
    ],
  },
  {
    title: "Armários Vestiários",
    slug: "armarios-vestiarios",
    products: [
      {
        name: "GRI",
        slug: "gri",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "GRI-1",
            scale: {
              height: "1980 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-2",
            scale: {
              height: "1980 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-3",
            scale: {
              height: "1980 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-4",
            scale: {
              height: "1980 mm",
              width: "1250 mm",
              depth: "420 mm",
            },
          },
        ],
        images: [
          "/assets/products/locker-rooms/gri1.jpeg",
          "/assets/products/locker-rooms/gri2.jpeg",
          "/assets/products/locker-rooms/gri3.jpeg",
          "/assets/products/locker-rooms/gri4.jpeg",
        ],
      },
      {
        name: "GAL",
        slug: "gal",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "GAL",
            scale: {
              height: "1980 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
        ],
        images: ["/assets/products/locker-rooms/gal.jpeg"],
      },
      {
        name: "GRS 2-8",
        slug: "grs2-8",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "GRS-2",
            scale: {
              height: "1980 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS-4",
            scale: {
              height: "1980 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS-6",
            scale: {
              height: "1980 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS-8",
            scale: {
              height: "1980 mm",
              width: "1250 mm",
              depth: "420 mm",
            },
          },
        ],
        images: [
          "/assets/products/locker-rooms/grs2.jpeg",
          "/assets/products/locker-rooms/grs4.jpeg",
          "/assets/products/locker-rooms/grs6.jpeg",
          "/assets/products/locker-rooms/grs8.jpeg",
        ],
      },
      {
        name: "GRS 4/2 - 20",
        slug: "grs42-8",
        description:
          "Lorem Ipsum is simply dummy text of the printing and typesetting.",

        models: [
          {
            name: "GRS 4/2",
            scale: {
              height: "1980 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS 8/4",
            scale: {
              height: "1980 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS 12",
            scale: {
              height: "1980 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS 16",
            scale: {
              height: "1980 mm",
              width: "1250 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRS 20",
            scale: {
              height: "1980 mm",
              width: "1540 mm",
              depth: "420 mm",
            },
          },
        ],
        images: [
          "/assets/products/locker-rooms/grs42.jpeg",
          "/assets/products/locker-rooms/grs84.jpeg",
          "/assets/products/locker-rooms/grs12.jpeg",
          "/assets/products/locker-rooms/grs16.jpeg",
          "/assets/products/locker-rooms/grs20.jpeg",
        ],
      },
    ],
  },
];
