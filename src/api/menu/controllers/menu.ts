/**
 * menu controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::menu.menu', ({})=>({
    async find(ctx){
        
      const result = await super.find(ctx);
      const entry = await strapi.db.query('api::menu.menu').findMany({
        select: ['title'],
        // where: { url: 'profil' },
        populate: ['title', 'page.url', 'page.pdf', 'page.pdf.file.src']
      });
      const result2 = entry.map((entity)=> {
        const page = entity.page.map((e)=> ({
            title: e.title,
            url: e.url,
            pdf: e.pdf?.map((e)=> ({title: e.title, file: e.file?.map((e)=> ({name: e.name, url: e.src.url}))}))
        }))
        return {title: entity.title, page: page}
      })
      console.log(result2)
      return result2;
    }
}));
