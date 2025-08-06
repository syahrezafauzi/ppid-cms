/**
 * menu2 controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::menu2.menu2", () => ({
  async view(ctx) {
    await this.validateQuery(ctx);
    const { url, id }: { id?: number; url?: string } = ctx.request.query;
    console.log("🚀 ~ view ~ url:", url, id);
    const query = await strapi.documents("api::menu2.menu2").findMany({
      select: ["title"],
      filters: {
        $or: [
          {
            page: {
              url: url
            },
          },
          {
            pages: {
              url: url,
            },
          },
        ],
      },
      populate: {
        page: {
          populate: { ...pageComponent },
        },
        pages: {
          populate: { ...pageComponent },
          filters: {
            url: url,
          },
        },
      },
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
        link: page.link?.map((e) => ({ ...e, toImage: e.toImage?.url })),
      };

    var result =
      Array.isArray(value) &&
      value?.map((e) => ({
        ...e,
        page: mapPage(e.page),
        pages: e.pages?.map((e) => mapPage(e)),
      }));
    return result;
    // const query = await strapi.documents("api::menu2.menu2").findMany({
    // //   select: ["title"],
    //   where: {
    //     $or: [
    //       {
    //         page: {
    //           id: id,
    //           url: url ? true : url
    //         },
    //       },
    //       {
    //         pages: {
    //             id: id,
    //             url: url ? true : url
    //         },
    //       },
    //     ],
    //   },
    //   populate: {
    //     page: {
    //       populate: {...pageComponent},
    //     },
    //     start: 0,
    //     limit: 10,
    //   },
    // });

    // const value = await this.sanitizeOutput(query, ctx);
    // const mapPage = (page) => ({
    //   ...page,
    //   pdf: page.pdf?.map((page) => ({
    //     title: page.title,
    //     file: page.file?.map((e) => ({ name: e.name, src: e.src.url })),
    //   })),
    //   image: page.image?.map((e) => e.url),
    //   link: page.link?.map((e) => ({ ...e, toImage: e.toImage?.url })),
    // });

    // var result =
    //   (Array.isArray(value) &&
    //     value?.map((e) => ({
    //       ...e,
    //       content: !e.content ? null : mapPage(e.content),
    //       page: e.page?.map((e) => mapPage(e)),
    //     }))) ||
    //   value;
    // return result;
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
      toImage: {},
    },
  },
};
