export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const category_selected = req.query.category;

  let categoryArray = [];

  categories.map((category) => {
    if (category_selected == category.slug) {
      categoryArray.push(category);
    }
  });

  if (category_selected == "all") {
    categoryArray = categories;
  }
  if (category_selected == "estante") {
    categories.map((category) => {
      if (
        category.category == "estantes-convencionais" ||
        category.category == "estantes-armazenagem"
      ) {
        categoryArray.push(category);
      }
    });
  }

  res.status(200).json({ categoryArray });
}

export const categories = [
  {
    name: "Armários Vestiários",
    singleName: "Armário Vestiário",
    slug: "armarios-vestiarios",
    image: "/assets/products/locker-rooms/roupeiro.png",
    description:
      "Nossos armários são produzidos com matéria prima de qualidade, conferindo maior durabilidade e resistência.",
    products: [
      {
        name: "GRSP 4/2 - 20",
        slug: "grsp42-8",
      },
      {
        name: "GRSP 2-8",
        slug: "grsp2-8",
      },
      {
        name: "GRI",
        slug: "gri",
      },
      {
        name: "Especiais",
        slug: "especiais",
      },
    ],
  },
  {
    name: "Armários",
    singleName: "Armário",
    slug: "armarios",
    image: "/assets/products/cabinets/a402_1.png",
    description:
      "Os armários desenvolvidos pela GGL, são os mais duradouros do ramo.",
    products: [
      {
        name: "A402",
        slug: "a402",
      },
      {
        name: "Professor",
        slug: "professor",
      },
      // {
      //   name: "Carrinho Notebook",
      //   slug: "notebook",
      // },
      {
        name: "Armário de Ferramentas",
        slug: "armario-de-ferramentas",
      },
      {
        name: "Armário de Limpeza",
        slug: "armario-de-limpeza",
      },
    ],
  },
  {
    name: "Arquivos",
    singleName: "Arquivo",
    slug: "arquivos",
    image: "/assets/products/files/ar4.png",
    description:
      "Em busca de estruturas para armazenar pastas ou fichas? Encontre nesta sessão os móveis necessários",
    products: [
      {
        name: "A-R4",
        slug: "a-r4",
      },
      {
        name: "GAM-5",
        slug: "gam-5",
      },
      {
        name: "GAM-6",
        slug: "gam-6",
      },
      {
        name: "GAM-7",
        slug: "gam-7",
      },
      {
        name: "GAM-8",
        slug: "gam-8",
      },
      {
        name: "GAM-10",
        slug: "gam-10",
      },
      {
        name: "Arquivos Mapoteca",
        slug: "mapoteca",
      },
    ],
  },
  {
    name: "Estantes Convencionais",
    singleName: "Estante Convencional",
    slug: "estantes-convencionais",
    category: "estantes-convencionais",
    image: "/assets/products/shelves/estante.png",
    description:
      "Estantes com prateleiras livre para organização de objetos, arquivos, etc",
    products: [
      {
        name: "Modelos PR",
        slug: "pr",
      },
    ],
  },
  {
    name: "Estantes Armazenagem",
    singleName: "Estante de Armazenagem",
    slug: "estantes-armazenagem",
    category: "estantes-armazenagem",
    image: "/assets/products/shelves/encaixe.png",
    description: "Estantes com prateleiras para acondicionar material pesado",
    products: [
      {
        name: "Modelos Armazenagem",
        slug: "encaixe",
      },
    ],
  },
  {
    name: "Biblioteca Encaixe",
    singleName: "Biblioteca de Encaixe",
    slug: "biblioteca-encaixe",
    category: "biblioteca-encaixe",
    image: "/assets/products/shelves/ede1100.png",
    description:
      "Estantes com prateleiras livre para organização de livros, revistas e mídia.",
    products: [
      {
        name: "Linha EDE",
        slug: "linha-ede",
      },
      {
        name: "Linha Estantes Trapezoidal",
        slug: "linha-estantes-trapezoidal",
      },
    ],
  },
  {
    name: "Armários Especiais",
    singleName: "Armário Especial",
    slug: "armarios-especiais",
    category: "armarios-especiais",
    image: "/assets/products/cabinets/especiais.png",
    description: "Armários metálicos resistentes, ideais para armazenar com segurança objetos pessoais ou equipamentos em ambientes corporativos, escolares ou industriais.",
    products: [
      {
        name: "Armário Guarda-Volumes",
        slug: "armario-guarda-volumes",
      },
      {
        name: "Armário Celular",
        slug: "armario-para-celular",
      },
    ],
  },
  {
    name: "Biblioteca Encaixe Coluna",
    singleName: "Biblioteca Encaixe Coluna",
    slug: "encaixe-coluna",
    category: "encaixe-coluna",
    image: "/assets/products/shelves/ed10.png",
    description:
      "Estantes com prateleiras livre para organização de livros, revistas e mídia.",
    products: [
      {
        name: "Linha PR",
        slug: "linha-pr",
      },
    ],
  },
  {
    name: "Gondolas",
    singleName: "Gondola",
    slug: "gondolas",
    image: "/assets/products/gondolas/centro.png",
    description: "Gondolas bem estruturadas e fortes para o seu varejo",
    products: [
      {
        name: "Modelos",
        slug: "modelos",
      },
    ],
  },
  {
    name: "Deslizantes",
    singleName: "Deslizante",
    slug: "deslizantes",
    image: "/assets/products/sliders/deslizante.png",
    description:
      "Armários deslizantes para facilitar a abertura e otimizar o espaço.",
    products: [
      {
        name: "Deslizante Inicial",
        slug: "deslizante-inicial",
      },
    ],
  },
];
