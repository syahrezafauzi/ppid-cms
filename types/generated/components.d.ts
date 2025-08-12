import type { Schema, Struct } from '@strapi/strapi';

export interface PageDip extends Struct.ComponentSchema {
  collectionName: 'components_page_dips';
  info: {
    displayName: 'DIP';
  };
  attributes: {
    bentuk_tersedia: Schema.Attribute.JSON &
      Schema.Attribute.CustomField<
        'plugin::multi-select.multi-select',
        ['Softcopy', 'Hardcopy']
      > &
      Schema.Attribute.DefaultTo<'[]'>;
    jangka_simpan: Schema.Attribute.String;
    judul_informasi: Schema.Attribute.String;
    media: Schema.Attribute.Component<'widget.link', false>;
    pejabat_menguasai: Schema.Attribute.String;
    pjp_info: Schema.Attribute.String;
    ringkasan: Schema.Attribute.String;
    waktu_pembuatan: Schema.Attribute.String;
  };
}

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
    link: Schema.Attribute.Component<'widget.link', true>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
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

export interface WidgetLink extends Struct.ComponentSchema {
  collectionName: 'components_widget_links';
  info: {
    displayName: 'Link';
    icon: 'link';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    icon: Schema.Attribute.Media<'images' | 'files' | 'videos' | 'audios'>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    subtitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
    url: Schema.Attribute.String;
  };
}

export interface WidgetMedia extends Struct.ComponentSchema {
  collectionName: 'components_widget_media';
  info: {
    displayName: 'Media';
  };
  attributes: {
    image: Schema.Attribute.Component<'widget.link', false>;
    slider: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    title: Schema.Attribute.String;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface WidgetSlider extends Struct.ComponentSchema {
  collectionName: 'components_widget_sliders';
  info: {
    displayName: 'Slider';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'>;
    subTitle: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'page.dip': PageDip;
      'page.file': PageFile;
      'page.page': PagePage;
      'page.pdf': PagePdf;
      'widget.link': WidgetLink;
      'widget.media': WidgetMedia;
      'widget.slider': WidgetSlider;
    }
  }
}
