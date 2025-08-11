/**
 * page controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::page.page", () => ({
  async view(ctx) {
    await this.validateQuery(ctx);
    const { url }: { url?: string } = ctx.request.query;
    const query = await strapi.documents("api::page.page").findMany({
      select: ["title", "content"],
      filters: { url },
      populate: { ...pageComponent },
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
        link: page.link?.map((e) => ({ ...e, page: e?.page?.url })),
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

const pageComponent = {
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
    },
  },
  // content: {},
};
