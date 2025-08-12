/**
 * page controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::page.page", () => ({
  async view(ctx) {
    await this.validateQuery(ctx);
    const { url }: { url?: string } = ctx.request.query;
    const query = await strapi.documents("api::page.page").findMany({
      select: ["title", "content", "excludePanel"],
      filters: { url },
      populate: { ...populateComponent },
      start: 0,
      limit: 10,
    });

    const value = await this.sanitizeOutput(query, ctx);
    const mapPage = (page) =>
      page && {
        ...page,
        pdf: page.pdf?.map((page) => ({
          title: page.title,
          file: page.file?.map((e) => ({ name: e.name, src: e.src.url })),
        })),
        image: page.image?.map((e) => e.url),
        link: page.link?.map((e) => ({
          ...e,
          page: e?.page?.url,
          icon: e?.icon?.url,
        })),
        other: page.other.reduce((acc, e) => {
          let current = acc[e.__component];
          if (!current) current = [];
          current.push({
            ...e,
            media: {
              page: e?.media?.page?.url,
              file: e?.media?.file?.url,
            },
          });

          acc[e.__component] = current;
          return acc;
        }, {}),
      };

    var result =
      Array.isArray(value) &&
      value?.map((e) => ({
        ...e,
        ...mapPage(e),
      }));
    return result;
  },
}));

const populateComponent = {
  pdf: {
    populate: {
      file: {
        populate: {
          src: {},
        },
      },
    },
  },
  image: {},
  link: {
    populate: {
      page: {},

      icon: {},
    },
  },
  other: {
    on: {
      "page.dip": {
        populate: {
          media: {
            populate: {
              file: {},
              page: {},
            },
          },
        },
      },
    },
  },
  // content: {},
};
