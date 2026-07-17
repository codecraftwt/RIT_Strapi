import type { Schema, Struct } from '@strapi/strapi';

export interface LayoutFooterColumn extends Struct.ComponentSchema {
  collectionName: 'components_layout_footer_columns';
  info: {
    description: 'A column of links in the footer';
    displayName: 'footer-column';
    icon: 'bulletList';
  };
  attributes: {
    links: Schema.Attribute.Component<'layout.footer-link', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LayoutFooterLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_footer_links';
  info: {
    description: 'A single link inside the footer column';
    displayName: 'footer-link';
    icon: 'link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface LayoutSocialLink extends Struct.ComponentSchema {
  collectionName: 'components_layout_social_links';
  info: {
    description: 'A social network link widget';
    displayName: 'social-link';
    icon: 'share';
  };
  attributes: {
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#'>;
    platform: Schema.Attribute.Enumeration<
      ['facebook', 'linkedin', 'twitter', 'instagram', 'youtube']
    > &
      Schema.Attribute.Required;
  };
}

export interface MainNavbarDropdownItem extends Struct.ComponentSchema {
  collectionName: 'components_main_navbar_dropdown_items';
  info: {
    description: 'A dropdown item within a menu item';
    displayName: 'dropdown-item';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sub_items: Schema.Attribute.Component<'main-navbar.sub-item', true>;
  };
}

export interface MainNavbarMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_main_navbar_menu_items';
  info: {
    description: 'A menu item in the main navigation bar';
    displayName: 'menu-item';
    icon: 'bulletList';
  };
  attributes: {
    dropdown_items: Schema.Attribute.Component<
      'main-navbar.dropdown-item',
      true
    >;
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface MainNavbarSubItem extends Struct.ComponentSchema {
  collectionName: 'components_main_navbar_sub_items';
  info: {
    description: 'A sub-item within a dropdown item';
    displayName: 'sub-item';
    icon: 'bulletList';
  };
  attributes: {
    href: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAboutContent extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_contents';
  info: {
    description: 'Reusable about content block with eyebrow, heading, body text, and image';
    displayName: 'about-content';
    icon: 'alignLeft';
  };
  attributes: {
    attributionName: Schema.Attribute.String;
    attributionTitle: Schema.Attribute.String;
    body: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
    imageCaption: Schema.Attribute.String;
    imagePosition: Schema.Attribute.Enumeration<['right', 'left']> &
      Schema.Attribute.DefaultTo<'right'>;
  };
}

export interface SectionsAboutRit extends Struct.ComponentSchema {
  collectionName: 'components_sections_about_rits';
  info: {
    description: 'Two-column About RIT section with text and image';
    displayName: 'about-rit';
    icon: 'informationCircle';
  };
  attributes: {
    body: Schema.Attribute.Text;
    buttonHref: Schema.Attribute.String;
    buttonLabel: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'KNOW MORE'>;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsAccreditationItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_accreditation_items';
  info: {
    description: 'Individual accreditation logo';
    displayName: 'accreditation-item';
    icon: 'award';
  };
  attributes: {
    abbr: Schema.Attribute.String & Schema.Attribute.Required;
    logo: Schema.Attribute.Media<'images'>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsAccreditations extends Struct.ComponentSchema {
  collectionName: 'components_sections_accreditations';
  info: {
    description: 'Accreditations and recognitions logo grid';
    displayName: 'accreditations';
    icon: 'award';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Accreditations & Recognitions'>;
    items: Schema.Attribute.Component<'sections.accreditation-item', true>;
  };
}

export interface SectionsCampusLife extends Struct.ComponentSchema {
  collectionName: 'components_sections_campus_lifes';
  info: {
    description: 'Campus life photo gallery section';
    displayName: 'campus-life';
    icon: 'image';
  };
  attributes: {
    body: Schema.Attribute.Text;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Campus Life'>;
    images: Schema.Attribute.Media<'images', true>;
  };
}

export interface SectionsCourseCategory extends Struct.ComponentSchema {
  collectionName: 'components_sections_course_categories';
  info: {
    description: 'A category of courses (e.g. Engineering, Diploma)';
    displayName: 'course-category';
    icon: 'folder';
  };
  attributes: {
    courses: Schema.Attribute.Component<'sections.course-item', true>;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCourseItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_course_items';
  info: {
    description: 'Individual course with name, duration, and campus info';
    displayName: 'course-item';
    icon: 'book';
  };
  attributes: {
    campus: Schema.Attribute.String & Schema.Attribute.DefaultTo<'On Campus'>;
    duration: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsCourses extends Struct.ComponentSchema {
  collectionName: 'components_sections_courses';
  info: {
    description: 'Filterable course cards section';
    displayName: 'courses';
    icon: 'book';
  };
  attributes: {
    categories: Schema.Attribute.Component<'sections.course-category', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Educate. Empower. Excel.'>;
    subheading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Industry-Relevant Programs'>;
  };
}

export interface SectionsExploreBox extends Struct.ComponentSchema {
  collectionName: 'components_sections_explore_boxes';
  info: {
    description: 'Individual explore campus box';
    displayName: 'explore-box';
    icon: 'map';
  };
  attributes: {
    href: Schema.Attribute.String;
    icon: Schema.Attribute.Enumeration<
      [
        'laptop',
        'graduation',
        'lightbulb',
        'bookOpen',
        'heart',
        'building',
        'camera',
        'play',
        'home',
        'office',
        'users',
        'globe',
        'school',
        'chartBar',
        'briefcase',
        'check',
        'trophy',
        'star',
        'award',
        'compass',
        'list',
        'map',
      ]
    > &
      Schema.Attribute.DefaultTo<'map'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsExploreCampus extends Struct.ComponentSchema {
  collectionName: 'components_sections_explore_campuses';
  info: {
    description: 'Campus exploration grid with icon boxes';
    displayName: 'explore-campus';
    icon: 'map';
  };
  attributes: {
    boxes: Schema.Attribute.Component<'sections.explore-box', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Explore the Campus'>;
  };
}

export interface SectionsFacilities extends Struct.ComponentSchema {
  collectionName: 'components_sections_facilities';
  info: {
    description: 'World-class facilities carousel section';
    displayName: 'facilities';
    icon: 'building';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'World Class Facilities'>;
    intro: Schema.Attribute.Text;
    items: Schema.Attribute.Component<'sections.facility-item', true>;
  };
}

export interface SectionsFacilityItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_facility_items';
  info: {
    description: 'Individual facility with title, description, and image';
    displayName: 'facility-item';
    icon: 'building';
  };
  attributes: {
    desc: Schema.Attribute.Text;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFeatureItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_feature_items';
  info: {
    description: 'Individual feature card with icon, title, and description';
    displayName: 'feature-item';
    icon: 'star';
  };
  attributes: {
    desc: Schema.Attribute.Text;
    icon: Schema.Attribute.Enumeration<
      [
        'laptop',
        'graduation',
        'lightbulb',
        'bookOpen',
        'heart',
        'building',
        'camera',
        'play',
        'home',
        'office',
        'users',
        'globe',
        'school',
        'chartBar',
        'briefcase',
        'check',
        'trophy',
        'star',
        'award',
        'compass',
        'list',
        'map',
      ]
    > &
      Schema.Attribute.DefaultTo<'star'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsGlobalEducation extends Struct.ComponentSchema {
  collectionName: 'components_sections_global_educations';
  info: {
    description: 'Global education partnerships section';
    displayName: 'global-education';
    icon: 'globe';
  };
  attributes: {
    body: Schema.Attribute.Text;
    features: Schema.Attribute.Component<'sections.global-feature', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Global Education'>;
    quote: Schema.Attribute.String;
  };
}

export interface SectionsGlobalFeature extends Struct.ComponentSchema {
  collectionName: 'components_sections_global_features';
  info: {
    description: 'Individual global education feature';
    displayName: 'global-feature';
    icon: 'globe';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'laptop',
        'graduation',
        'lightbulb',
        'bookOpen',
        'heart',
        'building',
        'camera',
        'play',
        'home',
        'office',
        'users',
        'globe',
        'school',
        'chartBar',
        'briefcase',
        'check',
        'trophy',
        'star',
        'award',
        'compass',
        'list',
        'map',
      ]
    > &
      Schema.Attribute.DefaultTo<'globe'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHeroSlide extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_slides';
  info: {
    description: 'Individual slide within the hero carousel';
    displayName: 'hero-slide';
    icon: 'landscape';
  };
  attributes: {
    heading: Schema.Attribute.String & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'>;
    link: Schema.Attribute.String;
    sub: Schema.Attribute.String;
    videoUrl: Schema.Attribute.String;
  };
}

export interface SectionsHeroSlider extends Struct.ComponentSchema {
  collectionName: 'components_sections_hero_sliders';
  info: {
    description: 'Full-width hero image carousel with text overlays';
    displayName: 'hero-slider';
    icon: 'landscape';
  };
  attributes: {
    slides: Schema.Attribute.Component<'sections.hero-slide', true>;
  };
}

export interface SectionsInfocusItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_infocus_items';
  info: {
    description: 'An individual item for the Infocus section';
    displayName: 'infocus-item';
    icon: 'picture';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsInfocusNews extends Struct.ComponentSchema {
  collectionName: 'components_sections_infocus_news';
  info: {
    description: 'Infocus & RIT in News double-slider section';
    displayName: 'infocus-news';
    icon: 'slideshow';
  };
  attributes: {
    infocusItems: Schema.Attribute.Component<'sections.infocus-item', true>;
    infocusTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Infocus'>;
    newsItems: Schema.Attribute.Component<'sections.news-item', true>;
    newsTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'RIT in News'>;
  };
}

export interface SectionsNewsItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_news_items';
  info: {
    description: 'An individual item for RIT in News';
    displayName: 'news-item';
    icon: 'file';
  };
  attributes: {
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsNoticeItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_notice_items';
  info: {
    description: 'An individual notice or announcement row item';
    displayName: 'notice-item';
    icon: 'bulletList';
  };
  attributes: {
    date: Schema.Attribute.String & Schema.Attribute.Required;
    link: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsNoticesAnnouncements extends Struct.ComponentSchema {
  collectionName: 'components_sections_notices_announcements';
  info: {
    description: 'A dual-column notices and announcements section';
    displayName: 'notices-announcements';
    icon: 'bulletList';
  };
  attributes: {
    announcements: Schema.Attribute.Component<'sections.notice-item', true>;
    announcementsTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Announcements'>;
    notices: Schema.Attribute.Component<'sections.notice-item', true>;
    noticesTitle: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Notices'>;
  };
}

export interface SectionsPlacementItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_placement_items';
  info: {
    description: 'Individual student placement highlight entry';
    displayName: 'placement-item';
    icon: 'user';
  };
  attributes: {
    companyLogo: Schema.Attribute.Media<'images'>;
    companyLogoUrl: Schema.Attribute.String;
    companyName: Schema.Attribute.String & Schema.Attribute.Required;
    packageInfo: Schema.Attribute.String & Schema.Attribute.Required;
    quote: Schema.Attribute.Text;
    studentName: Schema.Attribute.String & Schema.Attribute.Required;
    studentPhoto: Schema.Attribute.Media<'images'>;
    studentPhotoUrl: Schema.Attribute.String;
  };
}

export interface SectionsPlacements extends Struct.ComponentSchema {
  collectionName: 'components_sections_placements';
  info: {
    description: 'Placements highlights slider/grid section';
    displayName: 'placements';
    icon: 'briefcase';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'PLACEMENT @ 2024-25'>;
    items: Schema.Attribute.Component<'sections.placement-item', true>;
  };
}

export interface SectionsStatItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_stat_items';
  info: {
    description: 'Individual statistic with value, suffix, label, and icon';
    displayName: 'stat-item';
    icon: 'chartBar';
  };
  attributes: {
    icon: Schema.Attribute.Enumeration<
      [
        'laptop',
        'graduation',
        'lightbulb',
        'bookOpen',
        'heart',
        'building',
        'camera',
        'play',
        'home',
        'office',
        'users',
        'globe',
        'school',
        'chartBar',
        'briefcase',
        'check',
        'trophy',
        'star',
        'award',
        'compass',
        'list',
        'map',
      ]
    > &
      Schema.Attribute.DefaultTo<'chartBar'>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    suffix: Schema.Attribute.String & Schema.Attribute.DefaultTo<'+'>;
    value: Schema.Attribute.Integer & Schema.Attribute.Required;
  };
}

export interface SectionsStatsCounter extends Struct.ComponentSchema {
  collectionName: 'components_sections_stats_counters';
  info: {
    description: 'Animated statistics counter section';
    displayName: 'stats-counter';
    icon: 'chartBar';
  };
  attributes: {
    stats: Schema.Attribute.Component<'sections.stat-item', true>;
  };
}

export interface SectionsTestimonialItem extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonial_items';
  info: {
    description: 'Individual student testimonial';
    displayName: 'testimonial-item';
    icon: 'quote';
  };
  attributes: {
    dept: Schema.Attribute.String;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    photo: Schema.Attribute.Media<'images'>;
    text: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface SectionsTestimonials extends Struct.ComponentSchema {
  collectionName: 'components_sections_testimonials';
  info: {
    description: 'Student testimonials carousel';
    displayName: 'testimonials';
    icon: 'quote';
  };
  attributes: {
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Our Testimonial'>;
    items: Schema.Attribute.Component<'sections.testimonial-item', true>;
  };
}

export interface SectionsTwinningPrograms extends Struct.ComponentSchema {
  collectionName: 'components_sections_twinning_programs';
  info: {
    description: 'Twinning programs section with description, side graphic, and features grid';
    displayName: 'twinning-programs';
    icon: 'globe';
  };
  attributes: {
    ctaText: Schema.Attribute.String & Schema.Attribute.DefaultTo<'KNOW MORE'>;
    ctaUrl: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
    description: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'Twinning Programs'>;
    features: Schema.Attribute.Component<'sections.feature-item', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'TWINNING PROGRAMS AT RIT!'>;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SectionsWhyChooseRit extends Struct.ComponentSchema {
  collectionName: 'components_sections_why_choose_rits';
  info: {
    description: 'Feature grid highlighting why students should choose RIT';
    displayName: 'why-choose-rit';
    icon: 'star';
  };
  attributes: {
    features: Schema.Attribute.Component<'sections.feature-item', true>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Why Choose RIT'>;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'layout.footer-column': LayoutFooterColumn;
      'layout.footer-link': LayoutFooterLink;
      'layout.social-link': LayoutSocialLink;
      'main-navbar.dropdown-item': MainNavbarDropdownItem;
      'main-navbar.menu-item': MainNavbarMenuItem;
      'main-navbar.sub-item': MainNavbarSubItem;
      'sections.about-content': SectionsAboutContent;
      'sections.about-rit': SectionsAboutRit;
      'sections.accreditation-item': SectionsAccreditationItem;
      'sections.accreditations': SectionsAccreditations;
      'sections.campus-life': SectionsCampusLife;
      'sections.course-category': SectionsCourseCategory;
      'sections.course-item': SectionsCourseItem;
      'sections.courses': SectionsCourses;
      'sections.explore-box': SectionsExploreBox;
      'sections.explore-campus': SectionsExploreCampus;
      'sections.facilities': SectionsFacilities;
      'sections.facility-item': SectionsFacilityItem;
      'sections.feature-item': SectionsFeatureItem;
      'sections.global-education': SectionsGlobalEducation;
      'sections.global-feature': SectionsGlobalFeature;
      'sections.hero-slide': SectionsHeroSlide;
      'sections.hero-slider': SectionsHeroSlider;
      'sections.infocus-item': SectionsInfocusItem;
      'sections.infocus-news': SectionsInfocusNews;
      'sections.news-item': SectionsNewsItem;
      'sections.notice-item': SectionsNoticeItem;
      'sections.notices-announcements': SectionsNoticesAnnouncements;
      'sections.placement-item': SectionsPlacementItem;
      'sections.placements': SectionsPlacements;
      'sections.stat-item': SectionsStatItem;
      'sections.stats-counter': SectionsStatsCounter;
      'sections.testimonial-item': SectionsTestimonialItem;
      'sections.testimonials': SectionsTestimonials;
      'sections.twinning-programs': SectionsTwinningPrograms;
      'sections.why-choose-rit': SectionsWhyChooseRit;
    }
  }
}
