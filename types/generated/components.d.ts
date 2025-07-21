import type { Schema, Struct } from '@strapi/strapi';

export interface PageFile extends Struct.ComponentSchema {
  collectionName: 'components_page_files';
  info: {
    displayName: 'file';
  };
  attributes: {
    name: Schema.Attribute.String;
    src: Schema.Attribute.Media<'files'>;
  };
}

export interface PagePage extends Struct.ComponentSchema {
  collectionName: 'components_page_pages';
  info: {
    displayName: 'page';
  };
  attributes: {
    content: Schema.Attribute.RichText &
      Schema.Attribute.CustomField<
        'plugin::ckeditor5.CKEditor',
        {
          preset: 'defaultHtml';
        }
      >;
    image: Schema.Attribute.Media<'images', true>;
    pdf: Schema.Attribute.Component<'page.pdf', true>;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface PagePdf extends Struct.ComponentSchema {
  collectionName: 'components_page_pdfs';
  info: {
    displayName: 'pdf';
  };
  attributes: {
    file: Schema.Attribute.Component<'page.file', true>;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page.file': PageFile;
      'page.page': PagePage;
      'page.pdf': PagePdf;
    }
  }
}
