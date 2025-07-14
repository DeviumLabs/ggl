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
          "/assets/products/locker-rooms/gri1.png",
          "/assets/products/locker-rooms/gri2.png",
          "/assets/products/locker-rooms/gri3.png",
          "/assets/products/locker-rooms/gri4.png",
        ],
      },
      {
        name: "Especiais",
        slug: "especiais",
        description: categories[0].description,

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
        ],
        images: [
          "/assets/products/locker-rooms/roupeiro.png",
          "/assets/products/locker-rooms/insalubre.png",
          "/assets/products/locker-rooms/detail1.png",
          "/assets/products/locker-rooms/detail2.png",
          "/assets/products/locker-rooms/detail3.png",
        ],
      },
      {
        name: "GRSP 2-8",
        slug: "grsp2-8",
        description: categories[0].description,

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
          "/assets/products/locker-rooms/grs2.png",
          "/assets/products/locker-rooms/grs4.png",
          "/assets/products/locker-rooms/grs6.png",
          "/assets/products/locker-rooms/grs8.png",
        ],
      },
      {
        name: "GRSP 4/2 - 20",
        slug: "grsp42-8",
        description: categories[0].description,

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
          "/assets/products/locker-rooms/grs42.png",
          "/assets/products/locker-rooms/grs84.png",
          "/assets/products/locker-rooms/grs12.png",
          "/assets/products/locker-rooms/grs16.png",
          "/assets/products/locker-rooms/grs20.png",
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
        description: categories[1].description,
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
              height: "1750 mm",
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
        images: ["/assets/products/cabinets/a402_1.png"],
      },
      {
        name: "Armário Professor",
        slug: "professor",
        description: categories[1].description,
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
        images: ["/assets/products/cabinets/professor.png"],
      },
      // {
      //   name: "Carrinho Notebook",
      //   slug: "notebook",
      //   description: "Carrinho para notebook com capacidade para 32 notebooks",
      //   models: [
      //     {
      //       name: "Carrinho Notebook",
      //       scale: {
      //         height: "1100 mm",
      //         width: "910 mm",
      //         depth: "470 mm",
      //       },
      //     },
      //   ],
      //   images: [
      //     "/assets/products/cabinets/notebook2.png",
      //     "/assets/products/cabinets/notebook.png",
      //   ],
      // },
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
        images: ["/assets/products/locker-rooms/ferramentas.png"],
      },
      {
        name: "Armarinho de Limpeza",
        slug: "armario-de-limpeza",
        description: "Armário compacto para armazenar materiais de limpeza.",
        models: [
          {
            name: "Armarinho de Limpeza",
            scale: {
              height: "1900 mm",
              width: "500 mm",
              depth: "420 mm",
            },
          },
        ],
        images: [
          "/assets/products/locker-rooms/armarinho-limpeza.jpg",
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
        description: categories[2].description,
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
        images: [
          "/assets/products/files/ar4.png",
          "/assets/products/files/trilho-telescopico.png",
          "/assets/products/files/nylon.png",
        ],
      },
      {
        name: "GAM-5",
        slug: "gam-5",
        description: categories[2].description,
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
        images: ["/assets/products/files/gam-5.png"],
      },
      {
        name: "GAM-6",
        slug: "gam-6",
        description: categories[2].description,
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
        images: ["/assets/products/files/gam-6.png"],
      },
      {
        name: "GAM-7",
        slug: "gam-7",
        description: categories[2].description,
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
        images: ["/assets/products/files/gam-7.png"],
      },
      {
        name: "GAM-8",
        slug: "gam-8",
        description: categories[2].description,
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
        images: ["/assets/products/files/gam-8.png"],
      },
      {
        name: "GAM-10",
        slug: "gam-10",
        description: categories[2].description,
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
        images: ["/assets/products/files/gam-10.png"],
      },
      {
        name: "Arquivos Mapoteca",
        slug: "mapoteca",
        description: categories[2].description,
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
        images: ["/assets/products/files/mapoteca.png"],
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
        description: categories[3].description,

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
        images: ["/assets/products/shelves/estante.png"],
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
        description: categories[4].description,

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
        images: ["/assets/products/shelves/encaixe.png"],
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
            name: "EDE 1010",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
          {
            name: "ESE 1020",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "300 mm",
            },
          },
          {
            name: "ERE 1030",
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
          "/assets/products/shelves/ede1100.png",
          "/assets/products/shelves/ese.png",
          "/assets/products/shelves/ere.png",
          "/assets/products/shelves/estante_baixa.png",
        ],
      },
      {
        name: "Linha Estantes Trapezoidal",
        slug: "linha-estantes-trapezoidal",
        description:
          "Movéis focados em armazenar livros e revistas em bibliotecas contruídas para encaixe",
        models: [
          {
            name: "Estante Revista 1090",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
          {
            name: "Estante Simples 1100",
            scale: {
              height: "1980 mm",
              width: "1000 mm",
              depth: "300 mm",
            },
          },
          {
            name: "Estante Gaveta 1110",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
          {
            name: "Estante Dupla 1100",
            scale: {
              height: "2000 mm",
              width: "1000 mm",
              depth: "580 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/estante_livro.png",
          "/assets/products/shelves/estante_prateleira.png",
          "/assets/products/shelves/estante_gaveta.png",
          "/assets/products/shelves/gaveta_1100.png",
        ],
      },
    ],
  },
  {
    title: "Armários Especiais",
    slug: "armarios-especiais",
    category: "armarios-especiais",
    products: [
      {
        name: "Armário Guarda-Volumes",
        slug: "armario-guarda-volumes",
        description: "Armário guarda-volumes em aço com 6 compartimentos individuais, ideal para armazenamento seguro de pertences em ambientes corporativos, escolares ou industriais.",
        models: [
          {
            name: "Armário Guarda-Volumes",
            scale: {
              height: "1450 mm",
              width: "600 mm",
              depth: "450 mm",
            },
          },
        ],
        images: [
          "/assets/products/cabinets/guarda-volumes.png",
        ],
      },
      {
        name: "Armário para celular",
        slug: "armario-para-celular",
        description:
          "Armário para guardar celular.",
        models: [
          {
            name: "Armário Celular",
            scale: {
              height: "1000 mm",
              width: "800 mm",
              depth: "200 mm",
            },
          },
        ],
        images: [
          "/assets/products/cabinets/porta_celular.png",
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
        images: [
          "/assets/products/shelves/ed10.png",
          "/assets/products/shelves/es6pr.png",
          "/assets/products/shelves/er6pr.png",
        ],
      },
    ],
  },
  {
    title: "Porta Pallet",
    slug: "porta-pallet",
    category: "porta-pallet",
    products: [
      {
        name: "Mini Porta Pallet",
        slug: "mini-porta-pallet",
        description:
          "Estrutura robusta para armazenagem eficiente, ideal para organização de cargas paletizadas em espaços compactos.",

        models: [
          {
            name: "Mini Porta Pallet",
            scale: {
              height: "2000 mm",
              width: "1800 mm",
              depth: "800 mm",
            },
          },
        ],
        images: [
          "/assets/products/shelves/mini-porta-pallet.png",
        ],
      },
    ],
  },
  {
    title: "Gondolas",
    slug: "gondolas",
    products: [
      {
        name: "Modelos",
        slug: "modelos",
        description: categories[7].description,
        models: [
          {
            name: "Centro",
            scale: {
              height: "1700 mm",
              width: "1115 mm",
              depth: "800 mm",
            },
          },
          {
            name: "Parede",
            scale: {
              height: "1700 mm",
              width: "1115 mm",
              depth: "400 mm",
            },
          },
        ],

        images: [
          "/assets/products/gondolas/centro.png",
          "/assets/products/gondolas/parede.png",
        ],
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
        allBold: true,
        description: categories[8].description,

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
          "/assets/products/sliders/deslizante.png",
          "/assets/products/sliders/deslizante-2.jpeg",
        ],
      },
    ],
  },
];
