/**
 * menu controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::menu.menu", ({}) => ({
  async view(ctx) {
    await this.validateQuery(ctx);
    const { url } = ctx.request.query;
    const query = await strapi.documents("api::menu.menu").findMany({
      select: ["title"],
      where: {
        $or: [
          {
            content: {
              url: url,
            },
          },
          {
            page: {
              url: url,
            },
          },
        ],
      },
      populate: {
        content: {
          populate: {
            pdf: {
              populate: {
                file: {
                  populate: {
                    src: {},
                  },
                },
              },
            },
            link: {
              populate: {
                toImage: {},
              },
            },
          },
        },
        page: {
          filters: {
            url: url,
          },
          fields: ["title", "content"],
          populate: {
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
                toImage: {},
              },
            },
          },
        },
      },
      start: 0,
      limit: 10,
    });

    const value = await this.sanitizeOutput(query, ctx);
    const mapPage = (page) => ({
      ...page,
      pdf: page.pdf?.map((page) => ({
        title: page.title,
        file: page.file?.map((e) => ({ name: e.name, src: e.src.url })),
      })),
      image: page.image?.map((e) => e.url),
      link: page.link?.map((e) => ({ ...e, toImage: e.toImage?.url })),
    });

    var result =
      (Array.isArray(value) &&
        value?.map((e) => ({
          ...e,
          content: !e.content ? null : mapPage(e.content),
          page: e.page?.map((e) => mapPage(e)),
        }))) ||
      value;
    return result;
  },
}));
