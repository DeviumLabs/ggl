import { categories } from "./category";

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
    title: "Armários Vestiários",
    slug: "armarios-vestiarios",
    products: [
      {
        name: "GRI",
        slug: "gri",
        description: categories[0].description,

        models: [
          {
            name: "GRI-1",
            scale: {
              height: "1900 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-2",
            scale: {
              height: "1900 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-3",
            scale: {
              height: "1900 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRI-4",
            scale: {
              height: "1900 mm",
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
        name: "Especiais",
        slug: "especiais",
        description:
          categories[0].description,

        models: [
          {
            name: "GAL",
            scale: {
              height: "1900 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "Insalubre",
            scale: {
              height: "1900 mm",
              width: "1000 mm",
              depth: "420 mm",
            },
          },
          {
            name: "Armarinho de Limpeza",
            scale: {
              height: "1900 mm",
              width: "500 mm",
              depth: "420 mm",
            },
          },
        ],
        images: ["/assets/products/locker-rooms/gal.jpeg"],
      },
      {
        name: "GRSP 2-8",
        slug: "grsp2-8",
        description:
          categories[0].description,

        models: [
          {
            name: "GRSP-2",
            scale: {
              height: "1900 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP-4",
            scale: {
              height: "1900 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP-6",
            scale: {
              height: "1900 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP-8",
            scale: {
              height: "1900 mm",
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
        name: "GRSP 4/2 - 20",
        slug: "grsp42-8",
        description:
          categories[0].description,

        models: [
          {
            name: "GRSP 4/2",
            scale: {
              height: "1900 mm",
              width: "330 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP 8/4",
            scale: {
              height: "1900 mm",
              width: "630 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP 12",
            scale: {
              height: "1900 mm",
              width: "930 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP 16",
            scale: {
              height: "1900 mm",
              width: "1250 mm",
              depth: "420 mm",
            },
          },
          {
            name: "GRSP 20",
            scale: {
              height: "1900 mm",
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
  {
    title: "Armários",
    slug: "armarios",
    image: "",
    description: categories[1].description,
    products: [
      {
        name: "A402",
        slug: "a402",
        description:
          categories[1].description,
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
        description: "Armário para guardar celular com carregar ou modelo convencional.",
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
          "/assets/products/cabinets/celular2.jpg",
          "/assets/products/cabinets/celular.jpg",
        ],
      },
      {
        name: "Armário Professor",
        slug: "professor",
        description:
          categories[1].description,
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
      {
        name: "Armário de Ferramentas",
        slug: "armario-de-ferramentas",
        description: "Armário para guardar ferramentas.",
        models: [
          {
            name: "Armário de Ferramentas",
            scale: {
              height: "2000 mm",
              width: "1200 mm",
              depth: "450 mm",
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
          categories[2].description,
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
          categories[2].description,
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
          categories[2].description,
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
          categories[2].description,
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
          categories[2].description,
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
          categories[2].description,
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
          categories[2].description,
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
    title: "Estantes Convencionais",
    slug: "estantes-convencionais",
    category: "estantes-convencionais",
    products: [
      {
        name: "Modelos PR",
        slug: "pr",
        description:
        categories[3].description,

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
    slug: "estantes-armazenagem",
    category: "estantes-armazenagem",
    products: [
      {
        name: "Modelos Armazenagem",
        slug: "encaixe",
        description:
        categories[4].description,

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
    slug: "biblioteca-encaixe",
    category: "biblioteca-encaixe",
    products: [
      {
        name: "Linha EDE",
        slug: "linha-ede",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",

        models: [
          {
            name: "EDE 1100",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
          {
            name: "ESE 1110",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "300 mm",
            },
          },
          {
            name: "ERE 1090",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "440 mm",
            },
          },
          {
            name: "Estante Infantil",
            scale: {
              height: "1200 mm",
              width: "1000 mm",
              depth: "300 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/ere.jpeg",
          "/assets/products/shelves/ese.jpeg",
          "/assets/products/shelves/ere.jpeg",
          "/assets/products/shelves/estante_baixa.jpeg",
        ],
      },
      {
        name: "Linha Estantes Trapezoidal",
        slug: "linha-estantes-trapezoidal",
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
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/estante_livro.jpeg",
          "/assets/products/shelves/estante_prateleira.jpeg",
          "/assets/products/shelves/estante_gaveta.jpeg",
        ],
      },

    ],
  },
  {
    title: "Biblioteca Encaixe Coluna",
    slug: "encaixe-coluna",
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
          categories[7].description,
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
          categories[7].description,
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
    title: "Deslizantes",
    slug: "deslizantes",
    products: [
      {
        name: "Deslizante Inicial",
        slug: "deslizante-inicial",
        description:
          categories[8].description,

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
];
