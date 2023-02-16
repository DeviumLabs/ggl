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
    name: "Armários Vestiários ",
    slug: "armarios-vestiarios",
    image: "/assets/products/locker-rooms/roupeiro.jpeg",
    description:
      "Nossos armários são produzidos com matéria prima de qualidade, conferindo maior durabilidade e resistência.",
    products: [
      {
        name: "GAL",
        slug: "gal",
      },
      {
        name: "GRI",
        slug: "gri",
      },
      {
        name: "GRS 2-8",
        slug: "grs2-8",
      },
      {
        name: "GRS 4/2 - 20",
        slug: "grs42-8",
      },
    ],
  },
  {
    name: "Armários",
    slug: "armarios",
    image: "/assets/products/cabinets/a402_1.jpeg",
    description:
      "Os armários desevolvidos pela GGL, são os mais duradouros do ramo.",
    products: [
      {
        name: "A402",
        slug: "a402",
      },
      {
        name: "Armário Celular",
        slug: "armario-para-celular",
      },
      {
        name: "Professor",
        slug: "professor",
      },
      {
        name: "Carrinho Notebook",
        slug: "notebook",
      },
    ],
  },
  {
    name: "Arquivos",
    slug: "arquivos",
    image: "/assets/products/files/ar4.jpeg",
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
    slug: "estantes-convencionais",
    category: "estantes-convencionais",
    image: "/assets/products/shelves/pr30.jpeg",
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
    slug: "estantes-armazenagem",
    category: "estantes-armazenagem",
    image: "/assets/products/shelves/encaixe.jpeg",
    description:
      "Estantes com prateleiras para acondicionar material pesado",
    products: [
      {
        name: "Modelos Armazenagem",
        slug: "encaixe",
      },
    ],
  },
  {
    name: "Biblioteca Encaixe",
    slug: "biblioteca-encaixe",
    category: "biblioteca-encaixe",
    image: "/assets/products/shelves/ese.jpeg",
    description:
      "Estantes com prateleiras livre para organização de livros, revistas e mídia.",
    products: [
      {
        name: "Linha EDE",
        slug: "linha-ede",
      },
      {
        name: "Linha Estantes",
        slug: "linha-estantes",
      },
      {
        name: "Estantes Infantis",
        slug: "linha-infantil",
      },
    ],
  },
  {
    name: "Biblioteca Encaixe Coluna",
    slug: "encaixe-coluna",
    category: "encaixe-coluna",
    image: "/assets/products/shelves/ed10.jpeg",
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
    slug: "gondolas",
    image: "/assets/products/gondolas/gondola.jpeg",
    description: "Gondolas bem estruturadas e fortes para o seu varejo",
    products: [
      {
        name: "Centro",
        slug: "centro",
      },
      {
        name: "Parede",
        slug: "parede",
      },
    ],
  },
  {
    name: "Deslizantes",
    slug: "deslizantes",
    image: "/assets/products/sliders/deslizante.jpeg",
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
