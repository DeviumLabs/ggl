export default function handler(req, res) {
  res.status(200).json({ categories });
}

const categories = [
  {
    name: "Armários",
    slug: "armarios",
    image: "/assets/products/cabinets/a402_1.jpeg",
    description:
      "Os armários desevolvidos pela GGL, são os mais duradouros e leves do ramo.",
    products: [
      {
        name: "A402",
        slug: "a402",
      },
    ],
  },
  {
    name: "Arquivos",
    slug: "arquivos",
    image: "/assets/products/files/ar4.jpeg",
    description:
      "Em busca de estruturas para guardas e proteger arquivos? Encontre nesta sessão os móveis necessários",
    products: [
      {
        name: "A-R4",
        slug: "a-r4",
      },
    ],
  },
  {
    name: "Deslizantes",
    slug: "deslizantes",
    image: "/assets/products/sliders/deslizante.jpeg",
    description:
      "Armários deslizantes para facilitar a abertura e abranger o espaço interno",
    products: [
      {
        name: "Deslizante Inicial",
        slug: "deslizante-inicial",
      },
    ],
  },

  {
    name: "Estantes",
    slug: "estantes",
    image: "/assets/products/shelves/estante.jpeg",
    description:
      "Estantes com prateleiras livre para organização de objetos, arquivos, etc",
    products: [
      {
        name: "EDE",
        slug: "ede",
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
        name: "Balcão",
        slug: "balcao",
      },
    ],
  },
  {
    name: "Armários Vestiários ",
    slug: "armarios-vestiarios",
    image: "/assets/products/locker-rooms/roupeiro.jpeg",
    description:
      "Nossos armários contam com ferragens de qualidade, que confere maior durabilidade e resistência.",
    products: [
      {
        name: "GAL",
        slug: "gal",
      },
    ],
  },
];
