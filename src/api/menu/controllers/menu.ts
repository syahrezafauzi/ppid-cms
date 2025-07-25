/**
 * menu controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::menu.menu", ({ }) => ({
  async view(ctx) {
    await this.validateQuery(ctx);
    const { url } = ctx.request.query;
    const query = await strapi.documents("api::menu.menu").findMany({
      select: ["title"],
      where: {
        $or: [
          {
            content: {
              url: url
            }
          },
          {
            page: {
              url: url,
            },
          }]
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
          }
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
          },
        },
      },
      start: 0,
      limit: 10,
    });

    const value = await this.sanitizeOutput(query, ctx);
    var result = Array.isArray(value) && value?.map((e) => ({
      ...e,
      content: !e.content ? null : {
        ...e.content,
        pdf: e.pdf?.map((e) => ({
          title: e.title,
          file: e.file?.map((e) => ({ name: e.name, src: e.src.url })),
        }))
      },
      page: e.page?.map((e) => ({
        ...e,
        // Remaping pdf data
        pdf: e.pdf?.map((e) => ({
          title: e.title,
          file: e.file?.map((e) => ({ name: e.name, src: e.src.url })),
        })),
        // Remaping image data
        image: e.image?.map((e) => e.url)
      })),
    })) || value;
    return result;
  },
}));
