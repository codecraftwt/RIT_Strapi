'use strict';

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    // Prevent Cloudinary from deleting images when deleted from the Media Library
    const uploadProvider = strapi.plugin('upload').provider;
    if (uploadProvider) {
      uploadProvider.delete = async (file, customConfig) => {
        strapi.log.info(`Skipped Cloudinary deletion for file: ${file.name} to preserve the asset.`);
      };
    }

    await strapi.admin.services.permission.conditionProvider.register({
      displayName: 'Is Dept Admin for Department',
      name: 'is-dept-admin-for-dept',
      plugin: 'admin',
      async handler(user) {
        const mapping = await strapi.db.query('api::admin-department.admin-department').findOne({
          where: { admin_user_id: user.id },
          populate: ['department'],
        });
        if (!mapping || !mapping.department) return false;
        return { documentId: mapping.department.documentId };
      },
    });

    await strapi.admin.services.permission.conditionProvider.register({
      displayName: 'Is Dept Admin for Content',
      name: 'is-dept-admin-for-content',
      plugin: 'admin',
      async handler(user) {
        const mapping = await strapi.db.query('api::admin-department.admin-department').findOne({
          where: { admin_user_id: user.id },
          populate: ['department'],
        });
        if (!mapping || !mapping.department) return false;
        return { department: { documentId: mapping.department.documentId } };
      },
    });

    await strapi.admin.services.permission.conditionProvider.register({
      displayName: 'Is Dept Admin for Diploma',
      name: 'is-dept-admin-for-diploma',
      plugin: 'admin',
      async handler(user) {
        const mapping = await strapi.db.query('api::admin-diploma.admin-diploma').findOne({
          where: { admin_user_id: user.id },
          populate: ['diploma'],
        });
        if (!mapping || !mapping.diploma) return false;
        return { documentId: mapping.diploma.documentId };
      },
    });

    if (process.env.FORCE_SEED !== 'true') {
      strapi.log.info('Database seeding is disabled. Start the server with FORCE_SEED=true to seed resources.');
      return;
    }

    // await seedAdminRoles(strapi);
    // await seedAdminUsers(strapi);
    // await seedAdminDepartmentMappings(strapi);
    // await seedDeptAdminPermissions(strapi);
    // await seedHomeSections(strapi);
    // await seedAboutRitSection(strapi);
    // await seedDiplomas(strapi);
    // await seedPlacements(strapi);
    // await seedCourses(strapi);
    // await seedTestimonials(strapi);
    // await seedToppersChoice(strapi);
    // await seedHappeningNow(strapi);

    // Grant public API permissions (find/findOne on all content types) — no content changes
    // await seedPermissions(strapi);

    // const diplomaRole = await seedDiplomaAdminRole(strapi);
    // await seedDiplomaAdminUsers(strapi);
    // await seedAdminDiplomaMappings(strapi);
    // await seedDiplomaAdminPermissions(strapi);

    // Normalize diploma slugs (remove / and /diploma/ prefix)
    // await fixDiplomaSlugs(strapi);

    // Update main-navbar with correct diploma hrefs (no homepage/media changes)
    // await seedMainNavbar(strapi);

    strapi.log.info('Bootstrap complete — diploma RBAC + slug fix + navbar href fix seeded. Homepage/content seeding disabled.');
  },
};

async function seedPermissions(strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });

  if (!publicRole) {
    strapi.log.warn('Public role not found — skipping permission seed.');
    return;
  }

  const actions = [
    'api::header.header.find',
    'api::page.page.find',
    'api::page.page.findOne',
    'api::main-navbar.find',
    'api::main-navbar.main-navbar.find',
    'api::footer.footer.find',
    'api::department.department.find',
    'api::department.department.findOne',
    'api::diploma.diploma.find',
    'api::diploma.diploma.findOne',
  ];

  for (const action of actions) {
    const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!exists) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
      strapi.log.info(`Granted Public role: ${action}`);
    }
  }
}

async function seedHeader(strapi) {
  const existing = await strapi.db.query('api::header.header').findOne({});
  if (existing) return;

  await strapi.entityService.create('api::header.header', {
    data: {
      instituteName: 'Rajarambapu Institute of Technology',
      instituteSubtitle: 'An Empowered Autonomous Institute',
    },
  });

  strapi.log.info('Header seeded.');
}

async function seedFooter(strapi) {
  const existing = await strapi.db.query('api::footer.footer').findOne({});
  if (existing) return;

  await strapi.entityService.create('api::footer.footer', {
    data: {
      instituteName: 'Rajarambapu Institute of Technology, Rajaramnagar',
      instituteSubtitle: '(An Empowered Autonomous Institute)',
      address: 'Tal. Walwa, Dist. Sangli, Maharashtra, India (415414)',
      phone: '+91 2342-220329 / 99 70 700 700',
      email: 'director@ritindia.edu',
      columns: [
        {
          title: 'Useful Links',
          links: [
            { label: 'Anti Ragging Cell', href: '#' },
            { label: 'Scholarship', href: '#' },
            { label: 'Fee Structure', href: '#' },
            { label: 'Campus Placement', href: '#' },
            { label: 'Mandatory Disclosure', href: '#' },
            { label: 'AICTE Approvals', href: '#' },
            { label: 'RTI', href: '#' }
          ]
        },
        {
          title: 'Quick Links',
          links: [
            { label: 'RITAGE', href: '#' },
            { label: 'Moodle Server', href: '#' },
            { label: 'Annual Report', href: '#' },
            { label: 'NIRF', href: '#' },
            { label: 'e-Governance', href: '#' },
            { label: 'Foreign Language Learning', href: '#' },
            { label: 'Student Transcript', href: '#' }
          ]
        },
        {
          title: 'Other Links',
          links: [
            { label: 'Alumni Portal', href: '#' },
            { label: 'Technology Business Incubator', href: '#' },
            { label: 'IIC', href: '#' },
            { label: 'International Admission', href: '#' },
            { label: 'Grievances Redressal', href: '#' },
            { label: 'Code of Conduct', href: '#' }
          ]
        }
      ],
      socialLinks: [
        { platform: 'facebook', href: '#' },
        { platform: 'linkedin', href: '#' }
      ]
    },
  });

  strapi.log.info('Footer seeded.');
}

async function seedMainNavbar(strapi) {
  const existing = await strapi.db.query('api::main-navbar.main-navbar').findOne({});

  const menuItems = [
    {
      label: 'About Us',
      href: '#',
      dropdown_items: [
        { label: 'About RIT', href: '#' },
        { label: 'About KES', href: '#' },
        { label: 'Vision & Mission', href: '#' },
        { label: 'Director\'s Message', href: '#' },
        { label: 'Why Study at RIT', href: '#' },
        { label: 'Board of Governance', href: '#' },
        { label: 'Deans', href: '#' },
        { label: 'Organization Structure', href: '#' },
        { label: 'Academic Council', href: '#' },
        { label: 'College Development Committee', href: '#' },
        { label: 'Finance', href: '#' },
        { label: 'Graduation Ceremony', href: '#' },
        { label: 'Accreditation & Rankings', href: '#' },
        { label: 'Institute Policies', href: '#' },
        { label: 'Administrative Manual', href: '#' },
        { label: 'RIT Information Brochure', href: '#' },
        { label: 'IT Policy & Guidelines', href: '#' },
        { label: 'FAQs', href: '#' }
      ]
    },
    {
      label: 'Academic',
      href: '#',
      dropdown_items: [
        { label: 'Message from Dean Academics', href: '#' },
        {
          label: 'Programs',
          href: '#',
          sub_items: [
            { label: 'Diploma', href: '#' },
            { label: 'Under Graduate', href: '#' },
            { label: 'Post Graduate', href: '#' },
            { label: 'Ph.D.', href: '#' },
            { label: 'Management Studies', href: '#' },
            { label: 'Working Professional', href: '#' },
            { label: 'Computer Application', href: '#' }
          ]
        },
        { label: 'Academic Calendar', href: '#' },
        {
          label: 'Teaching Learning Process',
          href: '#',
          sub_items: [
            { label: 'Academics & NEP-2020 Implementation', href: '#' },
            { label: 'Three Track system for Final Year B.Tech', href: '#' },
            { label: 'Outcome Based Education (OBE) at RIT', href: '#' },
            { label: 'Center for Teaching & Learning', href: '#' }
          ]
        },
        {
          label: 'Examination Center',
          href: '#',
          sub_items: [
            { label: 'About Examination Center', href: '#' },
            { label: 'Examination Committee', href: '#' },
            { label: 'Exam Center Staff', href: '#' },
            { label: 'Department Examination Co-ordinators (DEC)', href: '#' },
            { label: 'Exam Schedule - Time Table', href: '#' },
            { label: 'Exam Forms', href: '#' },
            { label: 'Exam Rules & Regulations', href: '#' },
            { label: 'Assessment', href: '#' },
            { label: 'Policies', href: '#' },
            { label: 'FAQs', href: '#' }
          ]
        },
        {
          label: 'Academic Excellence Centers',
          href: '#',
          sub_items: [
            { label: 'Student Exchange Program', href: '#' },
            { label: 'Entrepreneurship Development Cell', href: '#' },
            { label: 'Gate Exam Cell', href: '#' },
            { label: 'Office of International Relations and Education', href: '#' },
            { label: 'Competitive Exam Cell', href: '#' }
          ]
        },
        { label: 'Academic Notifications', href: '#' },
        { label: 'All Courses PO, PSO and CO', href: '#' },
        { label: 'Academic Rules & Regulations', href: '#' },
        { label: 'Best Practices-Quality Circle', href: '#' },
        { label: 'Curriculum', href: '#' },
        { label: 'FAQs', href: '#' }
      ]
    },
    {
      label: 'Admission',
      href: '#',
      dropdown_items: [
        { label: 'FRA Fee Structure', href: '#' },
        { label: 'Admission', href: '#' },
        {
          label: 'UG Admission',
          href: '#',
          sub_items: [
            { label: 'First Year B.Tech', href: '#' },
            { label: 'Direct Second Year B.Tech', href: '#' }
          ]
        },
        {
          label: 'PG Admission',
          href: '#',
          sub_items: [
            { label: 'First Year M. Tech', href: '#' },
            { label: 'Schedule & Rules of M. Tech. Admission', href: '#' }
          ]
        },
        {
          label: 'Diploma Admission',
          href: '#',
          sub_items: [
            { label: 'First Year', href: '#' },
            { label: 'Direct Second Year', href: '#' }
          ]
        },
        {
          label: 'MBA Admission',
          href: '#',
          sub_items: [
            { label: 'MBA', href: '#' },
            { label: 'BBA', href: '#' }
          ]
        },
        {
          label: 'International Admission',
          href: '#',
          sub_items: [
            { label: 'International Admission', href: '#' },
            { label: 'Important Dates', href: '#' },
            { label: 'Programmes', href: '#' },
            { label: 'Eligibility & Document', href: '#' },
            { label: 'Facilities', href: '#' },
            { label: 'Admission Form', href: '#' },
            { label: 'Fees & Annual Expenditure for ICCR Students', href: '#' },
            { label: 'Study in India Fee Structure', href: '#' },
            { label: 'Photo Gallery', href: '#' }
          ]
        },
        { label: 'PG Diploma Offered by Southern University', href: '#' },
        { label: 'Fee Structure', href: '#' },
        { label: 'FAQs', href: '#' },
        { label: 'Admission Policy & Process 2022-23 & 2023-24', href: '#' },
        { label: 'Student Statistical Information', href: '#' },
        { label: 'Twinning Program', href: '#' },
        { label: 'Working Professional', href: '#' },
        { label: 'BBA', href: '#' },
        { label: 'BCA', href: '#' },
        { label: 'MCA', href: '#' },
        { label: 'Diploma in Taxation', href: '#' },
        { label: 'PGDLL', href: '#' }
      ]
    },
    {
      label: 'Departments',
      href: '#',
      dropdown_items: [
        { label: 'Sciences & Humanities', href: '/departments/sciences-humanities' },
        { label: 'Robotics and Automation', href: '/departments/robotics-automation' },
        { label: 'Civil Engineering', href: '/departments/civil-engineering' },
        { label: 'Computer Science & Engineering', href: '/departments/computer-science-engineering' },
        { label: 'Computer Science & Engineering (AI & ML)', href: '/departments/computer-science-engineering-ai-ml' },
        { label: 'Electrical Engineering', href: '/departments/electrical-engineering' },
        { label: 'Electronics and Telecommunication Engineering', href: '/departments/electronics-telecommunication-engineering' },
        { label: 'Information Technology', href: '/departments/information-technology' },
        { label: 'Mechanical Engineering', href: '/departments/mechanical-engineering' },
        { label: 'Automobile Engineering (Automotive Technology)', href: '/departments/automobile-engineering' },
        { label: 'Mechatronics Engineering', href: '/departments/mechatronics-engineering' },
        { label: 'Department of Management Studies (MBA)', href: '/departments/mba' },
        { label: 'HVAC Certification Course', href: '/departments/hvac-certification-course' },
        { label: 'Administrative Wing', href: '/departments/administrative-wing' },
        { label: 'BBA', href: '/departments/bba' },
        { label: 'Department of Computer Application', href: '/departments/computer-application' }
      ]
    },
    {
      label: 'Diploma',
      href: '/diploma',
      dropdown_items: [
        { label: 'Diploma', href: '/diploma' },
        { label: 'Science & Humanities', href: '/diploma/diploma-sciences-humanities' },
        { label: 'Automobile Engineering', href: '/diploma/diploma-automobile-engineering' },
        { label: 'Civil Engineering', href: '/diploma/diploma-civil-engineering' },
        { label: 'Mechanical Engineering', href: '/diploma/diploma-mechanical-engineering' },
        { label: 'Electrical Engineering', href: '/diploma/diploma-electrical-engineering' },
        { label: 'Computer Engineering', href: '/diploma/diploma-computer-engineering' },
        { label: 'Computer Hardware and Maintenance', href: '/diploma/diploma-computer-hardware-maintenance' },
        { label: 'Mechatronics', href: '/diploma/diploma-mechatronics' }
      ]
    },
    {
      label: 'Facility',
      href: '#',
      dropdown_items: [
        { label: 'Hostel', href: '#' },
        { label: 'Workshop', href: '#' },
        { label: 'Central Computing Facilities', href: '#' },
        {
          label: 'Library',
          href: '#',
          sub_items: [
            { label: 'About Library', href: '#' },
            { label: 'Digital Library', href: '#' },
            { label: 'Facility', href: '#' },
            { label: 'WEB OPAC - RIT Library', href: '#' },
            { label: 'Library Staff', href: '#' },
            { label: 'Best Practices', href: '#' },
            { label: 'Awards and Achievements', href: '#' },
            { label: 'Library Calendar', href: '#' },
            { label: 'RIT NDLI CLUB', href: '#' },
            { label: 'IRINS Services', href: '#' },
            { label: 'Remote Access to E-Resources', href: '#' }
          ]
        },
        {
          label: 'Infrastructure',
          href: '#',
          sub_items: [
            { label: 'Details of Land', href: '#' },
            { label: 'Carpet Area', href: '#' },
            { label: 'Built-up Area', href: '#' },
            { label: 'Policies For Maintenance', href: '#' },
            { label: 'Green Audit Report', href: '#' },
            { label: 'Energy Audit Report', href: '#' }
          ]
        },
        { label: 'FAQs', href: '#' }
      ]
    },
    {
      label: 'IQAC',
      href: '#',
      dropdown_items: [
        {
          label: 'IQAC Activities',
          href: '#',
          sub_items: [
            { label: 'IQAC Members', href: '#' },
            { label: 'Minutes of Meeting', href: '#' },
            { label: 'AAA Certificate', href: '#' },
            { label: 'AAA Certificate 2023-24', href: '#' },
            { label: 'Programs Organized', href: '#' },
            { label: 'Institutional Feedback', href: '#' }
          ]
        },
        {
          label: 'NAAC',
          href: '#',
          sub_items: [
            { label: 'IIQA', href: '#' },
            { label: 'NAAC Certificates', href: '#' },
            { label: 'NAAC Self Study Report Cycle II', href: '#' },
            { label: 'NAAC Self Study Report Cycle I', href: '#' },
            { label: 'AQAR', href: '#' },
            { label: 'NAAC Student Satisfaction Survey', href: '#' },
            { label: 'Best Practices', href: '#' },
            { label: 'Institutional Distinctiveness', href: '#' }
          ]
        },
        {
          label: 'NAAC Cycle II',
          href: '#',
          sub_items: [
            { label: 'Criterion 1: Curricular Aspects', href: '#' },
            { label: 'Criterion 2: Teaching-Learning and Evaluation', href: '#' },
            { label: 'Criterion 3: Research, Innovations and Extension', href: '#' },
            { label: 'Criterion 4: Infrastructure and Learning Resources', href: '#' },
            { label: 'Criterion 5: Student Support and Progression', href: '#' },
            { label: 'Criterion 6: Governance, Leadership and Management', href: '#' },
            { label: 'Criterion 7: Institutional Values and Best Practices', href: '#' },
            { label: 'DVV Clarification', href: '#' }
          ]
        },
        {
          label: 'NBA',
          href: '#',
          sub_items: [
            { label: 'NBA Accreditation Status', href: '#' }
          ]
        },
        {
          label: 'Academic Audit',
          href: '#',
          sub_items: [
            { label: 'Academic Audit 2022-23', href: '#' }
          ]
        }
      ]
    },
    {
      label: 'R & D',
      href: '#',
      dropdown_items: [
        {
          label: 'R & D Cell',
          href: '#',
          sub_items: [
            { label: 'About R & D Cell', href: '#' },
            { label: 'Research & Development Funds', href: '#' },
            { label: 'Research Focus Area', href: '#' },
            { label: 'Research & Development Activities', href: '#' },
            { label: 'Patents', href: '#' },
            { label: 'Product\'s Developed', href: '#' },
            { label: 'SEED Funding', href: '#' },
            { label: 'Policies', href: '#' },
            { label: 'COVID-19 Products Developed', href: '#' },
            { label: 'Research Publication', href: '#' },
            { label: 'Journal of Engineering Education Transformations', href: '#' }
          ]
        },
        { label: 'UBA 2.0', href: '#' },
        {
          label: 'Skill Development',
          href: '#',
          sub_items: [
            { label: 'PMKVY', href: '#' },
            { label: 'PMYUVA', href: '#' }
          ]
        },
        {
          label: 'NRiT RIT-TBI',
          href: '#',
          sub_items: [
            { label: 'About Us', href: '#' },
            { label: 'Certificate of Incorporation', href: '#' },
            { label: 'MSInS Letter of Intent', href: '#' },
            { label: 'Board of Directors', href: '#' },
            { label: 'Team NRiT TBI', href: '#' },
            { label: 'Organization Structure', href: '#' },
            { label: 'Advisory Committee', href: '#' },
            { label: 'Apply to NRiT TBI', href: '#' },
            { label: 'Firms in NRiT TBI', href: '#' },
            { label: 'NRiT TBI Activities', href: '#' },
            { label: 'Responsibilities of NRiT TBI', href: '#' },
            { label: 'Important Links', href: '#' },
            { label: 'Downloads', href: '#' },
            { label: 'Photo Gallery', href: '#' },
            { label: 'NRiT Achievements', href: '#' }
          ]
        },
        {
          label: 'CIIED',
          href: '#',
          sub_items: [
            { label: 'E-Cell', href: '#' },
            { label: 'Space Club', href: '#' },
            { label: 'ED Track', href: '#' }
          ]
        },
        {
          label: 'IIC',
          href: '#',
          sub_items: [
            { label: 'IIC Home', href: '#' },
            { label: 'IIC Members', href: '#' },
            { label: 'IIC Meetings', href: '#' },
            { label: 'Activities', href: '#' },
            { label: 'Policies', href: '#' },
            { label: 'Facilities', href: '#' },
            { label: 'MoUs', href: '#' },
            { label: 'Achievements', href: '#' },
            { label: 'Awards & Recognitions', href: '#' },
            { label: 'Contact Us', href: '#' }
          ]
        }
      ]
    },
    {
      label: 'Student DEV.',
      href: '#',
      dropdown_items: [
        { label: 'Quantum', href: '#' },
        { label: 'Sharadanyas', href: '#' },
        { label: 'Internal Complaints Committee', href: '#' },
        {
          label: 'Gymkhana',
          href: '#',
          sub_items: [
            { label: 'Sports', href: '#' },
            { label: 'NSS', href: '#' },
            { label: 'Vivek Vahini', href: '#' },
            { label: 'Student Council', href: '#' }
          ]
        },
        {
          label: 'Cultural Department',
          href: '#',
          sub_items: [
            { label: 'About Cultural Department', href: '#' },
            { label: 'Annual Report', href: '#' },
            { label: 'Drama Club', href: '#' },
            { label: 'Music Club', href: '#' },
            { label: 'Dance Club', href: '#' },
            { label: 'Arts Club', href: '#' },
            { label: 'Youth Festival', href: '#' },
            { label: 'Vishwakarma Magazine', href: '#' },
            { label: 'Virangula', href: '#' }
          ]
        },
        {
          label: 'Students Technical Clubs',
          href: '#',
          sub_items: [
            { label: 'IUCEE EWB', href: '#' },
            { label: 'Go Kart', href: '#' },
            { label: 'SAEINDIA', href: '#' },
            { label: 'Efficycle', href: '#' },
            { label: 'Space Club', href: '#' },
            { label: 'ISTE', href: '#' },
            { label: 'Android Club', href: '#' },
            { label: 'Drone Club', href: '#' },
            { label: 'GDSC', href: '#' },
            { label: 'Oyster Kode', href: '#' }
          ]
        },
        {
          label: 'Students Non Technical Clubs',
          href: '#',
          sub_items: [
            { label: 'Media Club', href: '#' },
            { label: 'E Cell', href: '#' },
            { label: 'Library Katta', href: '#' }
          ]
        },
        {
          label: 'Counselling Cell',
          href: '#',
          sub_items: [
            { label: 'About', href: '#' },
            { label: 'Manodarpan', href: '#' },
            { label: 'Structure', href: '#' },
            { label: 'Individual Counselling', href: '#' },
            { label: 'Merit Awards', href: '#' },
            { label: 'Parent Meet', href: '#' },
            { label: 'Mentoring', href: '#' }
          ]
        },
        {
          label: 'Hackathon',
          href: '#',
          sub_items: [
            { label: 'Smart India Hackathon', href: '#' },
            { label: 'RIT Hackathon', href: '#' }
          ]
        },
        {
          label: 'Alumni',
          href: '#',
          sub_items: [
            { label: 'Details', href: '#' },
            { label: 'Newsletter', href: '#' },
            { label: 'Support', href: '#' },
            { label: 'Testimonials', href: '#' },
            { label: 'Annual Report', href: '#' },
            { label: 'Meet Report', href: '#' }
          ]
        },
        { label: 'Students\' Talk', href: '#' },
        { label: 'Student Education Verification & Transcript', href: '#' }
      ]
    },
    {
      label: 'Placement',
      href: '#'
    },
    {
      label: 'NIRF',
      href: '#',
      dropdown_items: [
        { label: 'NIRF Engineering', href: '#' },
        { label: 'NIRF Management', href: '#' },
        { label: 'NIRF Innovation', href: '#' },
        { label: 'Faculty List', href: '#' },
        { label: 'Contact', href: '#' }
      ]
    },
    {
      label: 'Fee Structure',
      href: '#'
    },
    {
      label: 'Upcoming NBA Visit',
      href: '#'
    }
  ];

  if (existing) {
    await strapi.entityService.update('api::main-navbar.main-navbar', existing.id, {
      data: {
        menu_items: menuItems,
      },
    });
    strapi.log.info('Main Navbar updated with department URLs.');
  } else {
    await strapi.entityService.create('api::main-navbar.main-navbar', {
      data: {
        title: 'Main Navigation',
        menu_items: menuItems,
      },
    });
    strapi.log.info('Main Navbar seeded.');
  }
}

async function fixDiplomaSlugs(strapi) {
  try {
    const entries = await strapi.db.query('api::diploma.diploma').findMany();
    let fixed = 0;
    for (const entry of entries) {
      let slug = (entry.slug || '').trim();
      const original = slug;

      // Skip if already correct format (diploma-xxx, no leading slash)
      if (/^diploma-/.test(slug) || slug === 'diploma') continue;

      // /diploma/xxx → diploma-xxx
      slug = slug.replace(/^\/?diploma\//, 'diploma-');
      // /diploma-xxx → diploma-xxx (remove leading slash)
      slug = slug.replace(/^\//, '');
      // xxx (no diploma- prefix) → diploma-xxx
      if (!/^diploma-/.test(slug)) {
        slug = 'diploma-' + slug;
      }
      if (slug !== original) {
        await strapi.db.query('api::diploma.diploma').update({
          where: { id: entry.id },
          data: { slug },
        });
        strapi.log.info(`Fixed diploma slug: "${original}" → "${slug}"`);
        fixed++;
      }
    }
    strapi.log.info(`Diploma slug normalization complete — ${fixed} slugs fixed.`);
  } catch (err) {
    strapi.log.warn(`fixDiplomaSlugs error: ${err.message}`);
  }
}

async function seedPagePermissions(strapi) {
  const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
    where: { type: 'public' },
  });
  if (!publicRole) return;

  const actions = ['api::page.page.find', 'api::page.page.findOne'];
  for (const action of actions) {
    const exists = await strapi.db.query('plugin::users-permissions.permission').findOne({
      where: { action, role: publicRole.id },
    });
    if (!exists) {
      await strapi.db.query('plugin::users-permissions.permission').create({
        data: { action, role: publicRole.id },
      });
      strapi.log.info(`Granted Public role: ${action}`);
    }
  }
}

async function seedHomeSections(strapi) {
  let homePage = await strapi.db.query('api::page.page').findOne({
    where: { slug: '/' },
  });

  if (!homePage) {
    const created = await strapi.documents('api::page.page').create({
      data: { title: 'Home', slug: '/', content: '', sections: [] },
    });
    await strapi.documents('api::page.page').publish({ documentId: created.documentId });
    strapi.log.info('Home page created.');
    homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
  }

  const existingSections = homePage.sections || [];
  const existingTypes = new Set(existingSections.map((s) => s.__component));

  if (existingTypes.size > 1) {
    strapi.log.info(`Home page already has ${existingTypes.size} section types — skipping seed.`);
    return;
  }

  const sections = [
    {
      __component: 'sections.hero-slider',
      slides: [
        { heading: 'Discover More Than Just a Degree', sub: 'Rajarambapu Institute of Technology, Rajaramnagar', videoUrl: 'https://www.youtube.com/watch?v=vCNmisSETMc&t=2s' },
        { heading: 'Excellence in Engineering Education', sub: 'An Empowered Autonomous Institute' },
        { heading: 'Building Future Leaders', sub: '43 Acres of Green Campus' },
        { heading: 'Where Innovation Meets Education', sub: 'NAAC & NBA Accredited Programs' },
      ],
    },
    {
      __component: 'sections.twinning-programs',
      eyebrow: 'Twinning Programs',
      heading: 'TWINNING PROGRAMS AT RIT!',
      description: 'Rajarambapu Institute of Technology (RIT) got approval from the Government of India, All India Council for Technical Education (AICTE) to offer extensive twinning programs with esteemed foreign universities from all across the globe. These programs aim to provide students with a global education experience, enhancing their academic and professional capabilities through international exposure.',
      ctaText: 'KNOW MORE',
      ctaUrl: '#',
      features: [
        { title: 'AICTE', desc: 'Approval from the Government of India, All India Council for Technical Education (AICTE).', icon: 'star' },
        { title: 'Foreign Universities', desc: 'Offer extensive twinning programs with esteemed foreign universities.', icon: 'school' },
        { title: 'Global Education', desc: 'Aim to provide students with a global education experience.', icon: 'globe' },
        { title: 'International Exposure', desc: 'Enhancing academic and professional capabilities through international exposure.', icon: 'compass' },
      ],
    },
    {
      __component: 'sections.about-rit',
      eyebrow: 'About Our College',
      heading: 'Welcome To RIT',
      body: 'Rajarambapu Institute of Technology, Rajaramnagar (formerly known as the College of Engineering, Sakharale), was established in 1983. Situated near Islampur, just 7 km from Peth Naka on the Pune-Bangalore highway, the institute boasts a lush, green campus spread across 43 hectares, with a built-up area of 54,000 square meters. Over the past 43+ years, RIT has earned a reputation as a premier technological institute in Western Maharashtra, thanks to its dedicated and disciplined commitment to delivering quality technical education.',
      buttonLabel: 'KNOW MORE',
      buttonHref: '#',
    },
    {
      __component: 'sections.placements',
      heading: 'PLACEMENT @ 2024-25',
      items: [
        { studentName: 'MS. SHREYA KHOCHAGE', quote: 'PROUD MOMENT WITH ISRO - WHERE DREAMS TAKE FLIGHT, AND RIT LIGHTS THE PATH.', packageInfo: '6 Months ISRO Internship', companyName: 'Indian Space Research Organisation (ISRO)', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80' },
        { studentName: 'MS. DISHA SURYAWANSHI', quote: 'NEXT STOP: CORPORATE WORLD. GRATEFUL FOR THE SUPPORTIVE RIT PLACEMENT CELL.', packageInfo: '9 LPA Placement', companyName: 'Teachnook, Bangalore', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80' },
        { studentName: 'MR. OMPRASAD KANDE', quote: 'I DREAMED BIG, WORKED HARD, AND GOT PLACED - I DID IT!', packageInfo: '10 LPA Placement', companyName: 'Zensar Technologies', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
        { studentName: 'MS. DIPTI PATIL', quote: 'FROM RIT TO RELIANCE: MISSION ACCOMPLISHED. THE EDUCATION METRIC WORKED WONDERS.', packageInfo: '7.5 LPA Placement', companyName: 'Reliance Industries', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80' },
      ],
    },
    {
      __component: 'sections.notices-announcements',
      noticesTitle: 'Notices',
      announcementsTitle: 'Announcements',
      notices: [
        { title: 'Re-Exam Final Time Table FYBTech, FYMBA, FYMCA, FYBBA, SYBBA, FYBCA, FYMTech SYMTech July-Aug 2026', date: '13 Jul 2026', link: '#' },
        { title: 'Re- Exam Final Time Table July Aug 2026 SYBTech and TYBTech', date: '09 Jul 2026', link: '#' },
        { title: 'Re-Exam FYBTech, FYMBA, FYMCA, FYBBA, FYBCA, FYMTech Time Table July-Aug 2026', date: '07 Jul 2026', link: '#' },
        { title: 'Re-Exam Time Table June-July 2026', date: '19 Jun 2026', link: '#' },
      ],
      announcements: [
        { title: 'B.C.A. Against CAP Admission Schedule 2025-26', date: '06 Oct 2025', link: '#' },
        { title: 'B.B.A Admission for against CAP Vacancy Schedule 2025-26', date: '05 Oct 2025', link: '#' },
        { title: 'F.Y.B.Tech Institute Level Merit List Round - 2', date: '11 Sep 2025', link: '#' },
        { title: 'F.Y.B.Tech Against CAP Quota Merit List 2025-26', date: '10 Sep 2025', link: '#' },
      ],
    },
    {
      __component: 'sections.courses',
      heading: 'Educate. Empower. Excel.',
      subheading: 'Industry-Relevant Programs',
      categories: [
        { name: 'Engineering', courses: [
          { name: 'B. Tech Civil Engineering', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Computer Engineering', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech AI & ML', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech IT', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Electrical Engineering', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Electronics & Tele-communication', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Mechanical', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Mechatronics', duration: '4 Years', campus: 'On Campus' },
          { name: 'B. Tech Robotics', duration: '4 Years', campus: 'On Campus' },
          { name: 'M.Tech Computer Science and Engineering', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Construction Management', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Design Engineering', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Electronics Engineering', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Mechanical Engineering (Thermal Engineering)', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Power Systems and Power Electronics', duration: '2 Years', campus: 'On Campus' },
          { name: 'M.Tech Structural Engineering', duration: '2 Years', campus: 'On Campus' },
        ]},
        { name: 'Diploma', courses: [
          { name: 'Civil Engineering', duration: '3 Years', campus: 'On Campus' },
          { name: 'Computer Engineering', duration: '3 Years', campus: 'On Campus' },
          { name: 'Electrical Engineering', duration: '3 Years', campus: 'On Campus' },
          { name: 'Mechanical Engineering', duration: '3 Years', campus: 'On Campus' },
          { name: 'Mechatronics', duration: '3 Years', campus: 'On Campus' },
        ]},
        { name: 'Computer Application', courses: [
          { name: 'BCA', duration: '3 Years', campus: 'On Campus' },
          { name: 'MCA', duration: '2 Years', campus: 'On Campus' },
        ]},
        { name: 'Management', courses: [
          { name: 'BBA', duration: '3 Years', campus: 'On Campus' },
          { name: 'MBA', duration: '2 Years', campus: 'On Campus' },
        ]},
      ],
    },
    {
      __component: 'sections.why-choose-rit',
      heading: 'Why Choose RIT',
      features: [
        { icon: 'laptop', title: 'NEP', desc: 'New Education Policy helps to achieve Mastery of Learning' },
        { icon: 'graduation', title: 'Autonomous', desc: 'Institution delivering 21st Century Skills with an Industry 5.0 ready curriculum for future-ready engineers.' },
        { icon: 'lightbulb', title: 'RCOFT', desc: 'RIT Centre for Future Technology to prepare learners for INDUSTRY 5.0 and enhance Employability and Entrepreneurship.' },
        { icon: 'bookOpen', title: 'Learning by Doing', desc: 'All subjects are integrated with 50% Practical & Skill Development through PBL & CLAB Class in LAB system.' },
        { icon: 'heart', title: 'Less is More', desc: 'RIT adopts an innovative, effective, and student-centred learning experience.' },
        { icon: 'school', title: 'RTLC', desc: 'RIT Teaching Learning Centre provides a Learner Centric Environment for holistic growth.' },
      ],
    },
    {
      __component: 'sections.infocus-news',
      infocusTitle: 'Campus Spotlight',
      newsTitle: 'In The Press',
      infocusItems: [
        { title: 'RIT Director Dr. P. V. Kadake Receives National Level Eminent Director Award', link: '#' },
        { title: '33 RIT Students Selected for Bharat Forge', link: '#' },
        { title: 'RIT Dance Club Secures 1st Rank at Vasant Karandak 2026', link: '#' },
        { title: 'National Qawwali Competition – RIT Takes Top Honors', link: '#' },
        { title: 'ISTD Islampur Chapter (RIT) Receives ISTD Quality Performance Award 2026', link: '#' },
      ],
      newsItems: [
        { title: '33 RIT Students Selected for Bharat Forge', link: '#' },
        { title: 'RIT Dance Club Secures 1st Rank at Vasant Karandak 2026', link: '#' },
        { title: 'Blog Writing Competition at Folk Pravaah State Level Youth Festival 2026', link: '#' },
        { title: 'Shivaji University Annual Magazine Competition Honors RIT', link: '#' },
      ],
    },
    {
      __component: 'sections.facilities',
      heading: 'World Class Facilities',
      intro: 'At Rajarambapu Institute of Technology, Rajaramnagar, we go to great lengths to make sure we provide the best infrastructure and facilities for our students. With the right ambience, we can bring out the best potential hidden inside every student. We give the best facilities and ambience to students and expect the best performance from them, in return!',
      items: [
        { title: 'Centre for Excellence', desc: 'Top-performing students were honored with medals and certificates for their academic excellence and contributions in research and leadership.' },
        { title: 'Innovative Learning (IDEA Lab)', desc: 'The Idea Lab is a creative space designed to foster innovation, problem-solving, and hands-on learning. Equipped with tools and resources for prototyping and experimentation, it encourages students to explore new concepts and bring their ideas to life through practical application.' },
        { title: 'Computer Center', desc: 'RIT features a state-of-the-art centralized computer centre that supports effective learning. It provides students with the opportunity to explore and practice a variety of programming languages and computational skills. Additionally, the centre functions as the core facility for internet access and network connectivity across the campus.' },
        { title: 'Library', desc: 'The first library of its kind in Western Maharashtra, it is extensively equipped and spacious, catering to academic and research needs across all disciplines. It offers a wide collection of books, journals, and digital resources to enhance learning and knowledge. The library provides a quiet and conducive environment for study and research.' },
        { title: 'Conference Hall', desc: 'The campus includes three spacious and well-equipped conference halls, ideal for hosting seminars, workshops, and academic events. Each hall is fitted with modern audio-visual systems and interactive panels to enhance presentations and facilitate engaging discussions.' },
        { title: 'State of Art Labs', desc: 'The campus features state-of-the-art laboratories designed to provide hands-on experience across various disciplines. Equipped with advanced instruments and modern technology, these labs support practical learning, innovation, and research activities.' },
        { title: 'Gymnasium', desc: 'The modern gymnasium building offers a spacious and well-lit environment equipped with state-of-the-art fitness equipment. It provides students and staff with excellent facilities for physical fitness, wellness, and recreation. The contemporary design and serene surroundings create an inviting atmosphere for regular workouts.' },
        { title: 'Lecture Recording Studio', desc: 'A dedicated Lecture Recording Studio is available, equipped with advanced audio-visual technology to produce high-quality educational content. It allows faculty to record lectures efficiently, supporting online, hybrid, and self-paced learning. This facility enhances accessibility and engagement for students beyond the classroom.' },
        { title: 'International Hostel', desc: 'The Hostel offers a comfortable and secure living environment for students from abroad. It is designed with modern amenities, ensuring a homely atmosphere that supports both academic focus and cultural integration. The hostel promotes a global community experience on campus.' },
      ],
    },
    {
      __component: 'sections.global-education',
      heading: 'Global Education',
      body: 'RIT has established global partnerships with leading international universities and organizations for academic exchange, joint research, and collaborative programs.',
      quote: 'Global exchange of culture and knowledge opens doors to fresh perspectives.',
      features: [
        { label: '50+ Partnerships', icon: 'users' },
        { label: 'Global Events', icon: 'globe' },
        { label: 'Advisory Board', icon: 'school' },
        { label: '1000+ Students Trained', icon: 'list' },
      ],
    },
    {
      __component: 'sections.explore-campus',
      heading: 'Explore the Campus',
      boxes: [
        { icon: 'camera', label: 'Photo Gallery' },
        { icon: 'play', label: 'Video Gallery' },
        { icon: 'home', label: 'Hostel' },
        { icon: 'office', label: 'Guest House' },
        { icon: 'bookOpen', label: 'Library' },
        { icon: 'heart', label: 'Gymnasium' },
      ],
    },
    {
      __component: 'sections.campus-life',
      heading: 'Campus Life',
      body: 'Experience vibrant campus life at RIT with modern amenities, green spaces, and a thriving student community.',
    },
    {
      __component: 'sections.stats-counter',
      stats: [
        { label: 'Alumni', value: 27000, suffix: '+', icon: 'users' },
        { label: 'Acres Green Campus', value: 43, suffix: '', icon: 'globe' },
        { label: 'Placements in 2024-25', value: 650, suffix: '+', icon: 'briefcase' },
        { label: 'Years of Excellence', value: 43, suffix: '+', icon: 'check' },
      ],
    },
    {
      __component: 'sections.accreditations',
      heading: 'Accreditations & Recognitions',
      items: [
        { name: 'AICTE', abbr: 'AICTE' },
        { name: 'UGC', abbr: 'UGC' },
        { name: 'DTE', abbr: 'DTE' },
        { name: 'Shivaji University', abbr: 'SU' },
        { name: 'NAAC', abbr: 'NAAC' },
        { name: 'NBA', abbr: 'NBA' },
      ],
    },
    {
      __component: 'sections.testimonials',
      heading: 'Our Testimonial',
      items: [
        { name: 'Mrs. Shreya Kale', dept: 'Student', text: 'I fill proud saying, I\'m Alumini of RIT. Its not only an institute who serves technical & practical knowledge but also motivates against social responsibilities. It is an institute where future life enriches with a good spirit.\n\nI\'ve been passed out from RIT, taking a First Class grade in Diploma in Automobile Engineering (2015-2018). The journey with this institute was amazing.' },
        { name: 'Miss. Mohini Vijay Shelake (Batch: 2017-18)', dept: 'Student', text: 'Hello everyone I\'m Mohini Shelake, I have completed my diploma in Civil Engineering Department from Rajarambapu Institute of Technology, Rajaramnagar in year 2018. Now I am pursuing Bachelor in Civil Engineering from reputed institute.\n\nWell RIT is an autonomous Institute and in this institute has excellent & highly qualified faculties. RIT follows outcome based education.' },
        { name: 'Mr. Shahid Yunus Shaikh (Batch: 2019-20)', dept: 'Student', text: 'Hello Everyone I\'m Shahid Yunus Shaikh I have completed my diploma in Civil engineering in 2020 from Rajarambapu Institute of Technology, Rajaramnagar.\n\nI feel very grateful for being passed out from such a highly ranked college in all over India. This Institute has very good and excellent Infrastructure.' },
        { name: 'Ms. Swarali Sunil Kadam', dept: 'Student', text: 'I have completed diploma at RIT, Rajaramanagar in Electrical Engineering 2020-21.\n\nIt was such a great experience! In RIT they have experienced and talented faculty members. They teach us informative knowledge useful in our future studies.' },
      ],
    },
  ];

  await strapi.documents('api::page.page').update({
    documentId: homePage.documentId,
    data: { sections },
  });

  await strapi.documents('api::page.page').publish({
    documentId: homePage.documentId,
  });

  strapi.log.info(`Home page seeded with ${sections.length} sections and published.`);
}

async function seedAboutRitSection(strapi) {
  try {
    const homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });
    if (!homePage) {
      strapi.log.warn('seedAboutRitSection: Home page not found — skipping.');
      return;
    }

    // Check if about-rit already exists in the draft (which has the actual sections)
    const existingAboutRit = await strapi.db.connection.raw(
      `SELECT pc.id FROM pages_cmps pc
       JOIN components_sections_about_rits csar ON pc.cmp_id = csar.id
       WHERE pc.entity_id = ? AND pc.component_type = 'sections.about-rit' LIMIT 1`,
      [homePage.id]
    );
    if (existingAboutRit.rows.length > 0) {
      strapi.log.info('seedAboutRitSection: sections.about-rit already exists on home page — skipping.');
      return;
    }

    // Read current sections via document service (draft version)
    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const hasAboutRit = currentSections.some(s => s.__component === 'sections.about-rit');
    if (hasAboutRit) {
      strapi.log.info('seedAboutRitSection: sections.about-rit already exists (doc service check) — skipping.');
      return;
    }

    // Find twinning-programs index
    const twinningIdx = currentSections.findIndex(s => s.__component === 'sections.twinning-programs');
    if (twinningIdx === -1) {
      strapi.log.warn('seedAboutRitSection: sections.twinning-programs not found — skipping.');
      return;
    }

    // Build new sections array with about-rit inserted after twinning-programs
    const aboutRitSection = {
      __component: 'sections.about-rit',
      eyebrow: 'About Our College',
      heading: 'Welcome To RIT',
      body: 'Rajarambapu Institute of Technology, Rajaramnagar (formerly known as the College of Engineering, Sakharale), was established in 1983. Situated near Islampur, just 7 km from Peth Naka on the Pune-Bangalore highway, the institute boasts a lush, green campus spread across 43 hectares, with a built-up area of 54,000 square meters. Over the past 43+ years, RIT has earned a reputation as a premier technological institute in Western Maharashtra, thanks to its dedicated and disciplined commitment to delivering quality technical education.',
      buttonLabel: 'KNOW MORE',
      buttonHref: '#',
    };

    const newSections = [
      ...currentSections.slice(0, twinningIdx + 1),
      aboutRitSection,
      ...currentSections.slice(twinningIdx + 1),
    ];

    // Update draft with new sections
    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    // Publish
    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('seedAboutRitSection: sections.about-rit inserted after twinning-programs and published.');
  } catch (err) {
    strapi.log.warn(`seedAboutRitSection error: ${err.message}`);
  }
}

async function seedDepartments(strapi) {
  const departmentsData = [
    { name: "Sciences & Humanities", slug: "sciences-humanities", fieldsCount: 5, menu_items: [{ label: "About Department", dropdown_items: [{ label: "Overview", href: "#" }, { label: "Vision & Mission", href: "#" }, { label: "HOD's Message", href: "#" }] }, { label: "Academic Programs", dropdown_items: [{ label: "First Year B.Tech", href: "#" }, { label: "Curriculum & Syllabus", href: "#" }] }, { label: "Faculty", dropdown_items: [{ label: "Faculty Profiles", href: "#" }, { label: "Staff", href: "#" }] }, { label: "Labs & Facilities", dropdown_items: [{ label: "Chemistry Lab", href: "#" }, { label: "Physics Lab", href: "#" }, { label: "Language Lab", href: "#" }] }, { label: "Contact", dropdown_items: [{ label: "Office Address", href: "#" }, { label: "Inquiries", href: "#" }] }] },
    { name: "Robotics and Automation", slug: "robotics-automation", fieldsCount: 6, menu_items: [{ label: "Overview", href: "#" }, { label: "Academics", dropdown_items: [{ label: "B.Tech Robotics", href: "#" }, { label: "Syllabus", href: "#" }] }, { label: "Faculty", href: "#" }, { label: "Labs & Projects", dropdown_items: [{ label: "Robotics Lab", href: "#" }, { label: "Automation Lab", href: "#" }] }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Civil Engineering", slug: "civil-engineering", fieldsCount: 6, menu_items: [{ label: "Overview", href: "#" }, { label: "Academics", dropdown_items: [{ label: "Undergraduate", href: "#" }, { label: "Postgraduate", href: "#" }] }, { label: "Faculty Directory", href: "#" }, { label: "Labs & Testing", dropdown_items: [{ label: "Concrete Technology Lab", href: "#" }, { label: "Testing & Consultancy Services", href: "#" }] }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Computer Science & Engineering", slug: "computer-science-engineering", fieldsCount: 7, menu_items: [{ label: "About CSE", dropdown_items: [{ label: "Overview", href: "#" }, { label: "Vision & Mission", href: "#" }, { label: "HOD Message", href: "#" }] }, { label: "Academics", dropdown_items: [{ label: "B.Tech text", href: "#" }] }, { label: "Faculty Profiles", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Placements", href: "#" }, { label: "Student Activities", href: "#" }, { label: "Contact Us", href: "#" }] },
    { name: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)", slug: "computer-science-engineering-ai-ml", fieldsCount: 7, menu_items: [{ label: "About AI-ML", href: "#" }, { label: "Academics", dropdown_items: [{ label: "B.Tech AI & ML", href: "#" }] }, { label: "Faculty Directory", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Placements", href: "#" }, { label: "AI & ML Club", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Electrical Engineering", slug: "electrical-engineering", fieldsCount: 6, menu_items: [{ label: "About EE", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty Directory", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Placement Records", href: "#" }, { label: "Contact Us", href: "#" }] },
    { name: "Electronics and Telecommunication Engineering", slug: "electronics-telecommunication-engineering", fieldsCount: 6, menu_items: [{ label: "About ENTC", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty Directory", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Placements", href: "#" }, { label: "Contact Us", href: "#" }] },
    { name: "Information Technology", slug: "information-technology", fieldsCount: 6, menu_items: [{ label: "About IT", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Placement Statistics", href: "#" }, { label: "Contact Us", href: "#" }] },
    { name: "Mechanical Engineering", slug: "mechanical-engineering", fieldsCount: 8, menu_items: [{ label: "About Mechanical", dropdown_items: [{ label: "Overview", href: "#" }, { label: "Vision & Mission", href: "#" }, { label: "HOD Message", href: "#" }] }, { label: "Academic Programs", dropdown_items: [{ label: "B.Tech Mechanical", href: "#" }, { label: "M.Tech Design", href: "#" }, { label: "M.Tech Thermal", href: "#" }] }, { label: "Faculty Profiles", href: "#" }, { label: "Laboratories", href: "#" }, { label: "Projects & Research", href: "#" }, { label: "Placements & Internships", href: "#" }, { label: "Alumni Connect", href: "#" }, { label: "Contact Us", href: "#" }] },
    { name: "Automobile Engineering (Presently Automotive Technology)", slug: "automobile-engineering", fieldsCount: 6, menu_items: [{ label: "About Dept", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty Profiles", href: "#" }, { label: "Automotive Labs", href: "#" }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Mechatronics Engineering", slug: "mechatronics-engineering", fieldsCount: 6, menu_items: [{ label: "About Dept", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty Profiles", href: "#" }, { label: "Mechatronics Lab", href: "#" }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Department of Management Studies (MBA)", slug: "mba", fieldsCount: 6, menu_items: [{ label: "About MBA", href: "#" }, { label: "Academics", href: "#" }, { label: "Faculty Profiles", href: "#" }, { label: "Facilities", href: "#" }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "HVAC Certification Course", slug: "hvac-certification-course", fieldsCount: 5, menu_items: [{ label: "About Course", href: "#" }, { label: "Eligibility", href: "#" }, { label: "Syllabus", href: "#" }, { label: "Job Opportunities", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Administrative Wing", slug: "administrative-wing", fieldsCount: 5, menu_items: [{ label: "About Wing", href: "#" }, { label: "Staff Profiles", href: "#" }, { label: "Services", href: "#" }, { label: "Policies", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "BBA", slug: "bba", fieldsCount: 5, menu_items: [{ label: "About BBA", href: "#" }, { label: "Eligibility & Fees", href: "#" }, { label: "Faculty Profiles", href: "#" }, { label: "Placements", href: "#" }, { label: "Contact", href: "#" }] },
    { name: "Department of Computer Application", slug: "computer-application", fieldsCount: 6, menu_items: [{ label: "About DCA", href: "#" }, { label: "Academics", dropdown_items: [{ label: "BCA Program", href: "#" }, { label: "MCA Program", href: "#" }] }, { label: "Faculty Directory", href: "#" }, { label: "Labs & CCF", href: "#" }, { label: "Placement Statistics", href: "#" }, { label: "Contact", href: "#" }] }
  ];

  for (const dept of departmentsData) {
    const fullMenuItems = [
      { label: "Home", href: "/" },
      ...dept.menu_items
    ];

    const existing = await strapi.db.query('api::department.department').findOne({
      where: { slug: dept.slug }
    });

    if (!existing) {
      await strapi.documents('api::department.department').create({
        data: {
          name: dept.name,
          slug: dept.slug,
          description: `Welcome to the official portal of the Department of ${dept.name}.`,
          menu_items: fullMenuItems,
          sections: []
        }
      });
      strapi.log.info(`Department seeded and published: ${dept.name}`);
    } else {
      const updateData = { menu_items: fullMenuItems };
      await strapi.documents('api::department.department').update({
        documentId: existing.documentId,
        data: updateData
      });
      strapi.log.info(`Updated existing department ${dept.name} navbar links.`);
    }
  }
}


async function seedAdminRoles(strapi) {
  let role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-dept-admin' } });
  if (!role) {
    role = await strapi.db.query('admin::role').create({
      data: {
        name: 'Dept Admin (HOD)',
        code: 'strapi-dept-admin',
        description: 'Department Admin',
      }
    });
    strapi.log.info('Created Dept Admin role.');
  } else if (role.name !== 'Dept Admin (HOD)') {
    await strapi.db.query('admin::role').update({
      where: { id: role.id },
      data: { name: 'Dept Admin (HOD)' }
    });
  }
}

async function seedAdminUsers(strapi) {
  const bcrypt = require('bcryptjs');
  const role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-dept-admin' } });
  if (!role) return;

  const users = [
    { email: 'cse.hod@ritindia.edu', firstname: 'CSE', lastname: 'HOD', username: 'cse.hod' },
    { email: 'it.hod@ritindia.edu', firstname: 'IT', lastname: 'HOD', username: 'it.hod' },
    { email: 'entc.hod@ritindia.edu', firstname: 'ENTC', lastname: 'HOD', username: 'entc.hod' },
    { email: 'me.hod@ritindia.edu', firstname: 'ME', lastname: 'HOD', username: 'me.hod' },
  ];

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  for (const u of users) {
    const exists = await strapi.db.query('admin::user').findOne({ where: { email: u.email } });
    if (!exists) {
      await strapi.db.query('admin::user').create({
        data: {
          ...u,
          password: passwordHash,
          isActive: true,
          roles: [role.id],
        }
      });
      strapi.log.info(`Created admin user: ${u.email}`);
    } else {
      // Ensure they only have the dept admin role
      await strapi.db.query('admin::user').update({
        where: { id: exists.id },
        data: { roles: [role.id] }
      });
    }
  }
}

async function seedAdminDepartmentMappings(strapi) {
  const mappings = [
    { email: 'cse.hod@ritindia.edu', deptSlug: 'computer-science-engineering' },
    { email: 'it.hod@ritindia.edu', deptSlug: 'information-technology' },
    { email: 'entc.hod@ritindia.edu', deptSlug: 'electronics-telecommunication-engineering' },
    { email: 'me.hod@ritindia.edu', deptSlug: 'mechanical-engineering' },
  ];

  for (const m of mappings) {
    const user = await strapi.db.query('admin::user').findOne({ where: { email: m.email } });
    const dept = await strapi.db.query('api::department.department').findOne({ where: { slug: m.deptSlug } });

    if (user && dept) {
      const exists = await strapi.db.query('api::admin-department.admin-department').findOne({ where: { admin_user_id: user.id } });
      if (!exists) {
        await strapi.documents('api::admin-department.admin-department').create({
          data: {
            admin_user_id: user.id,
            admin_email: user.email,
            department: dept.documentId,
          }
        });
        strapi.log.info(`Mapped ${user.email} to ${dept.name}`);
      }
    }
  }
}

async function seedPlacements(strapi) {
  try {
    let homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });

    if (!homePage) {
      const created = await strapi.documents('api::page.page').create({
        data: { title: 'Home', slug: '/', content: '', sections: [] },
      });
      await strapi.documents('api::page.page').publish({ documentId: created.documentId });
      homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
    }

    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const placementsIdx = currentSections.findIndex(s => s.__component === 'sections.placements');

    const placementSection = {
      __component: 'sections.placements',
      heading: 'PLACEMENT @ 2025-26',
      items: [
        { studentName: 'MS. SHREYA KHOCHAGE', quote: 'PROUD MOMENT WITH ISRO - WHERE DREAMS TAKE FLIGHT, AND RIT LIGHTS THE PATH.', packageInfo: '6 Months ISRO Internship', companyName: 'Indian Space Research Organisation (ISRO)', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80' },
        { studentName: 'MS. DISHA SURYAWANSHI', quote: 'NEXT STOP: CORPORATE WORLD. GRATEFUL FOR THE SUPPORTIVE RIT PLACEMENT CELL.', packageInfo: '9 LPA Placement', companyName: 'Teachnook, Bangalore', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80' },
        { studentName: 'MR. OMPRASAD KANDE', quote: 'I DREAMED BIG, WORKED HARD, AND GOT PLACED - I DID IT!', packageInfo: '10 LPA Placement', companyName: 'Zensar Technologies', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80' },
        { studentName: 'MS. DIPTI PATIL', quote: 'FROM RIT TO RELIANCE: MISSION ACCOMPLISHED. THE EDUCATION METRIC WORKED WONDERS.', packageInfo: '7.5 LPA Placement', companyName: 'Reliance Industries', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=600&q=80' },
        { studentName: 'MR. ADITYA SHINDE', quote: 'RIT PREPARED ME FOR THE REAL WORLD. THE PLACEMENT TRAINING WAS A GAME CHANGER.', packageInfo: '8 LPA Placement', companyName: 'Tata Consultancy Services', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80' },
        { studentName: 'MS. PRIYA PATIL', quote: 'FROM CLASSROOM TO CORPORATE - RIT MADE IT POSSIBLE.', packageInfo: '6.5 LPA Placement', companyName: 'Wipro Technologies', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80' },
        { studentName: 'MR. RAHUL JADHAV', quote: 'THE SKILLS I LEARNED AT RIT HELPED ME STAND OUT IN THE INTERVIEW.', packageInfo: '12 LPA Placement', companyName: 'Infosys Limited', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&q=80' },
        { studentName: 'MS. SNEHA MORE', quote: 'GRATEFUL FOR THE SUPPORTIVE FACULTY AND THE PLACEMENT CELL AT RIT.', packageInfo: '7 LPA Placement', companyName: 'Cognizant Technology Solutions', companyLogoUrl: '', studentPhotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80' },
      ],
    };

    let newSections;
    if (placementsIdx !== -1) {
      newSections = [...currentSections];
      newSections[placementsIdx] = placementSection;
    } else {
      newSections = [...currentSections, placementSection];
    }

    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('Placements section seeded/updated with PLACEMENT @ 2025-26 data.');
  } catch (err) {
    strapi.log.warn(`seedPlacements error: ${err.message}`);
  }
}

async function seedCourses(strapi) {
  try {
    let homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });

    if (!homePage) {
      const created = await strapi.documents('api::page.page').create({
        data: { title: 'Home', slug: '/', content: '', sections: [] },
      });
      await strapi.documents('api::page.page').publish({ documentId: created.documentId });
      homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
    }

    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const coursesIdx = currentSections.findIndex(s => s.__component === 'sections.courses');

    const coursesSection = {
      __component: 'sections.courses',
      heading: 'Educate. Empower. Excel.',
      subheading: 'Industry-Relevant Programs',
      categories: [
        {
          name: 'Engineering',
          courses: [
            { name: 'B. Tech Civil Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Computer Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech AI & ML', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech IT', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Electrical Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Electronics & Tele-communication', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Mechanical', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Mechatronics', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Robotics', duration: '4 Years', campus: 'On Campus' },
            { name: 'M.Tech Computer Science and Engineering', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Construction Management', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Design Engineering', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Electronics Engineering', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Mechanical Engineering (Thermal Engineering)', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Power Systems and Power Electronics', duration: '2 Years', campus: 'On Campus' },
            { name: 'M.Tech Structural Engineering', duration: '2 Years', campus: 'On Campus' },
          ],
        },
        {
          name: 'Diploma',
          courses: [
            { name: 'Civil Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Computer Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Electrical Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Mechanical Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Mechatronics', duration: '3 Years', campus: 'On Campus' },
          ],
        },
        {
          name: 'Computer Application',
          courses: [
            { name: 'BCA', duration: '3/4 Years', campus: 'On Campus' },
            { name: 'MCA', duration: '2 Years', campus: 'On Campus' },
          ],
        },
        {
          name: 'Management',
          courses: [
            { name: 'BBA', duration: '3/4 Years', campus: 'On Campus' },
            { name: 'MBA', duration: '2 Years', campus: 'On Campus' },
          ],
        },
        {
          name: 'Twinning Program',
          courses: [
            { name: 'B. Tech Mechanical Engineering', duration: '2+2 / 2+3 Years', campus: 'On Campus 2 Years + Partner University 2/3 Years' },
            { name: 'B. Tech Civil Engineering', duration: '2+2 / 2+3 Years', campus: 'On Campus 2 Years + Partner University 2/3 Years' },
            { name: 'B. Tech Computer Engineering', duration: '2+2 / 2+3 Years', campus: 'On Campus 2 Years + Partner University 2/3 Years' },
            { name: 'B. Tech Electrical Engineering', duration: '2+2 / 2+3 Years', campus: 'On Campus 2 Years + Partner University 2/3 Years' },
            { name: 'B. Tech Electronics & Telecommunication', duration: '2+2 / 2+3 Years', campus: 'On Campus 2 Years + Partner University 2/3 Years' },
            { name: 'M. Tech Computer Science and Engineering', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M. Tech Design Engineering', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M. Tech Electronics Engineering', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M. Tech Mechanical Engineering (Thermal)', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M. Tech Power Systems and Power Electronics', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M. Tech Structural Engineering', duration: '1+1 Years', campus: 'On Campus 1 Year + Partner University 1 Year' },
            { name: 'M.B.A', duration: '2 Years', campus: 'On Campus' },
          ],
        },
        {
          name: 'Working Professional',
          courses: [
            { name: 'Diploma Civil Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Diploma Electrical Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'Diploma Mechanical Engineering', duration: '3 Years', campus: 'On Campus' },
            { name: 'B. Tech Computer Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Electronics and Telecommunication Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'B. Tech Mechanical Engineering', duration: '4 Years', campus: 'On Campus' },
            { name: 'M. Tech Structural Engineering', duration: '2 Years', campus: 'On Campus' },
            { name: 'M. Tech Computer Science and Engineering', duration: '2 Years', campus: 'On Campus' },
            { name: 'M. Tech Power Systems and Power Electronics', duration: '2 Years', campus: 'On Campus' },
          ],
        },
      ],
    };

    let newSections;
    if (coursesIdx !== -1) {
      newSections = [...currentSections];
      newSections[coursesIdx] = coursesSection;
    } else {
      newSections = [...currentSections, coursesSection];
    }

    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('Courses section seeded/updated with all 6 categories.');
  } catch (err) {
    strapi.log.warn(`seedCourses error: ${err.message}`);
  }
}

async function seedTestimonials(strapi) {
  try {
    let homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });

    if (!homePage) {
      const created = await strapi.documents('api::page.page').create({
        data: { title: 'Home', slug: '/', content: '', sections: [] },
      });
      await strapi.documents('api::page.page').publish({ documentId: created.documentId });
      homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
    }

    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const testimonialsIdx = currentSections.findIndex(s => s.__component === 'sections.testimonials');

    const testimonialsSection = {
      __component: 'sections.testimonials',
      heading: 'Our Testimonial',
      items: [
        {
          name: 'Mr. Shreyash Kale',
          dept: 'Student',
          text: "I fill proud saying, I'm Alumini of RIT. Its not only an institute who serves technical & practical knowledge but also motivates against social responsibilities. It is an institute where future life enriches with a good spirit.\n\nI've been passed out from RIT, taking a First Class grade in Diploma in Automobile Engineering (2015-2018). The journey with this institute was amazing, with supportive faculty and a great learning environment.",
        },
        {
          name: 'Miss. Mohini Vijay Shelake (Batch: 2017-18)',
          dept: 'Student',
          text: "Hello everyone I'm Mohini Shelake, I have completed my diploma in Civil Engineering Department from Rajarambapu Institute of Technology, Rajaramnagar in year 2018. Now I am pursuing Bachelor in Civil Engineering from reputed institute.\n\nWell RIT is an autonomous Institute and in this institute has excellent & highly qualified faculties. RIT follows outcome based education which helps students understand concepts better.",
        },
        {
          name: 'Mr. Shahid Yunus Shaikh (Batch: 2019-20)',
          dept: 'Student',
          text: "Hello Everyone I'm Shahid Yunus Shaikh I have completed my diploma in Civil engineering in 2020 from Rajarambapu Institute of Technology, Rajaramnagar.\n\nI feel very grateful for being passed out from such a highly ranked college in all over India. This Institute has very good and excellent Infrastructure. It also has highly qualified teachers and conducts outcome based learning.",
        },
        {
          name: 'Adarsh G. Jagtap',
          dept: 'Student',
          text: "As RITian I feel very proud that I have been a part of this truly developing institute. I am very thankful to experienced and talented faculties to enhance my skills throughout the course and moulding my personality in a right way.\n\nAll faculties are not only delivering the best but also motivating to make us socially responsible citizens by their super powerful thoughts. I am very glad that I am a part of RIT.",
        },
        {
          name: 'Nikhil Prakash Shendage',
          dept: 'Student',
          text: "I am very glad while giving this note. After the parents the person who really cares you is a teacher. hugeness of college depends mainly upon the students and teachers, because both gives important contribution for calling it as best college.\n\nThese college days is one of my best days in my whole life, because it really gives the feeling like we are in home. Also our institute has excellent facilities.",
        },
        {
          name: 'Ms. Swarali Sunil Kadam',
          dept: 'Student',
          text: "I have completed diploma at RIT, Rajaramanagar in Electrical Engineering 2020-21.\n\nIt was such a great experience! In RIT they have experienced and talented faculty members. They teach us informative knowledge useful in our future studies. One of the many things I like about RIT is that they teach us till we understood the particular concept.",
        },
        {
          name: 'Ms. Yogita Gaikwad',
          dept: 'Student',
          text: "Hi I'm Yogita Gaikwad. Recently I've completed my diploma in electrical engineering from Rajarambapu Institute of Technology. Campus is peaceful and very good for students. All facilities are provided for students like Internet, Gymkhana etc.\n\nThe college has huge library with technical as well as non-technical books. Our electrical department has talented, enthusiastic and supportive faculty members.",
        },
        {
          name: 'Ms. Monali Jayprakash Patil',
          dept: 'Student',
          text: "I have completed diploma in RIT, Rajaramanagar, in electrical engineering in 2018-19.\n\nIt was such a great experience! RIT has experienced and talented faculty members, who gave us very informative knowledge not only from books, but they gave us some extra knowledge and information about further education. I have learnt a lot from each and every faculty of RIT.",
        },
        {
          name: 'Mr. Sourabh V. Londhe',
          dept: 'Student',
          text: "Hello everyone I'm Sourabh Londhe. I have completed my diploma in electrical engineering from Rajarambapu Institute of Technology in year 2018. Presently I'm studying engineering in Pune.\n\nThe campus of RIT College is very good for education. This electrical department has very good quality of teachers, they are kind towards each and every individual also they are very much supportive.",
        },
        {
          name: 'Mr. Varadraj Bhargav Jadhav',
          dept: 'Student',
          text: "I have completed diploma at RIT, Rajaramanagar in Electrical Engineering 2021-22.\n\nAll the faculty members of RIT are experienced and talented. They not only teach informative knowledge useful in our exam but also many more which is needed for being good human. RIT gives me the platform for more job opportunities, future studies and to pursue sustainable career.",
        },
        {
          name: 'Aayuti Chougule',
          dept: 'B. Tech',
          text: "My experience at RIT has been wonderful. The college provides excellent academic support and has a great campus environment. The faculty members are knowledgeable and always ready to help students. I am grateful for the opportunities RIT has given me.",
        },
        {
          name: 'Ms. Prajakta Devidas Suryawanshi',
          dept: 'Recruitment Associate (Grade-2)',
          text: "My experience at RIT MBA is great and memorable. The mentors helped enhance my academic and interpersonal skills. I am thankful to Training & Placement cell for providing a platform to enhance my skills and for organising placements in this pandemic and helping students get placed.\n\nThe infrastructure of RIT is one of the finest. It was my immense luck and fortune to be the part of RIT.",
        },
        {
          name: 'Pratiksha Kore',
          dept: 'Relationship Manager at ICICI Bank, Pune',
          text: "Dear Friends, Greetings…!!!\n\nGetting placed during the college is a dream for all the students and this dream came to reality when I got placed in ICICI BANK. I and my parents are really thankful to the management and college authorities for making my dream come into reality. I got placed in ICICI Bank as a Relationship Manager.\n\nI feel, it is because of the efforts put by our faculty and placement cell.",
        },
        {
          name: 'Aishwarya Patil',
          dept: 'Entrepreneur',
          text: "I feel proud that I was one of the student of MBA at RIT. The college library and surrounding environment was very good that always gave me positive energy.\n\nWe have the best faculty team who provides a 360 degree support to the students. The department has made me to gain knowledge about business, ethics, personality and professionalism. My doubts and queries were always welcomed.",
        },
        {
          name: 'Dhiraj Nine',
          dept: 'Department Manager, Dmart Avenue Supermarts Ltd.',
          text: "RIT has been a great contributor to the development of my personality. I have established my leadership, time management and team skills and have also been able to advance these skills to the whole new level.\n\nThe infrastructure of RIT, especially the library is one of the finest in the region. The best thing about RIT is the cross-culture interaction between students from various parts of the country.",
        },
        {
          name: 'Anuradha Kumbhar',
          dept: 'Student',
          text: "My time at RIT has been a wonderful journey. The college provides a great learning environment with supportive faculty and excellent infrastructure. I am grateful for the knowledge and skills I have gained here.",
        },
        {
          name: 'Swapnagandha Patil',
          dept: 'Research Executive, The Research Insights',
          text: "I am proud to have been an MBA student at RIT. The college library and the surrounding environment were exceptional, consistently providing me with positive energy and a conducive atmosphere for learning.\n\nThe faculty team at RIT is outstanding, offering comprehensive support to students. The department has equipped me with extensive knowledge about business, ethics, personality development, and professionalism.",
        },
        {
          name: 'Aaditi Jadhav',
          dept: 'Customer Experience Executive HDFC Bank, Satara',
          text: "My time in the RIT MBA program has been incredible and unforgettable. The mentors greatly improved my academic and interpersonal skills. I'm grateful to the Training & Placement cell for providing opportunities to develop my skills and for organizing placements during the pandemic, helping students secure jobs.\n\nRIT's infrastructure is top-notch. I feel very fortunate to be part of RIT.",
        },
      ],
    };

    let newSections;
    if (testimonialsIdx !== -1) {
      newSections = [...currentSections];
      newSections[testimonialsIdx] = testimonialsSection;
    } else {
      newSections = [...currentSections, testimonialsSection];
    }

    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('Testimonials section seeded/updated with 18 testimonials.');
  } catch (err) {
    strapi.log.warn(`seedTestimonials error: ${err.message}`);
  }
}

async function seedToppersChoice(strapi) {
  try {
    let homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });

    if (!homePage) {
      const created = await strapi.documents('api::page.page').create({
        data: { title: 'Home', slug: '/', content: '', sections: [] },
      });
      await strapi.documents('api::page.page').publish({ documentId: created.documentId });
      homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
    }

    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const toppersIdx = currentSections.findIndex(s => s.__component === 'sections.toppers-choice');

    const toppersSection = {
      __component: 'sections.toppers-choice',
      heading: "TOPPERS' TOP CHOICE.",
      subheading: 'EXPERIENTIAL LEARNING.',
      yellowHeading: 'FANTABULOUS CAMPUS.',
      body: 'RIT is the most preferred institution for high ranking students. With industry-relevant curriculum, project based learning, high energy faculty, corporate-like facilities, best amenities and vibrant activities, RIT is the most sought after institution for high quality and holistic education.',
      highlightText: 'TOP PLACEMENTS COLLEGE!',
      buttonLabel: 'KNOW MORE',
      buttonHref: '#',
      gridItems: [
        {
          cardType: 'image',
          imageWidth: 'full',
          marginTop: '20px',
        },
        {
          cardType: 'image',
          imageWidth: 'full',
        },
        {
          cardType: 'image',
          imageWidth: 'full',
        },
        {
          cardType: 'image',
          imageWidth: 'full',
        },
        {
          cardType: 'blue',
          text: 'RANKED IN NIRF 2024\n201 - 300 BAND\nUNDER ENGINEERING CATEGORY',
        },
      ],
    };

    let newSections;
    if (toppersIdx !== -1) {
      newSections = [...currentSections];
      newSections[toppersIdx] = toppersSection;
    } else {
      newSections = [...currentSections, toppersSection];
    }

    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('Toppers Choice section seeded/updated.');
  } catch (err) {
    strapi.log.warn(`seedToppersChoice error: ${err.message}`);
  }
}

async function seedHappeningNow(strapi) {
  try {
    let homePage = await strapi.db.query('api::page.page').findOne({
      where: { slug: '/' },
    });

    if (!homePage) {
      const created = await strapi.documents('api::page.page').create({
        data: { title: 'Home', slug: '/', content: '', sections: [] },
      });
      await strapi.documents('api::page.page').publish({ documentId: created.documentId });
      homePage = await strapi.db.query('api::page.page').findOne({ where: { slug: '/' } });
    }

    const draft = await strapi.documents('api::page.page').findOne({
      documentId: homePage.documentId,
      populate: ['sections'],
    });

    const currentSections = draft?.sections || [];
    const happeningIdx = currentSections.findIndex(s => s.__component === 'sections.happening-now');

    const happeningSection = {
      __component: 'sections.happening-now',
      heading: 'Happening Now @ RIT',
      eventsTitle: 'Upcoming Events & Conference',
      achievementsTitle: 'Achievement',
      events: [
        {
          month: 'Aug',
          date: '22',
          title: 'Alumni Get-Together of Silver Jubilee Batches – 2000 and 2001 with all Seniors',
          organizer: 'Rajarambapu Institute of Technology, Rajaramnagar',
          link: '#',
        },
        {
          month: 'Sep',
          date: '15',
          title: 'National Conference on Emerging Trends in Engineering and Technology (NCETET 2026)',
          organizer: 'RIT Department of Computer Science & Engineering',
          link: '#',
        },
        {
          month: 'Oct',
          date: '05',
          title: 'Annual Tech Festival — RITAGE 2026',
          organizer: 'RIT Student Technical Council',
          link: '#',
        },
      ],
      achievements: [
        {
          heading: '33 RIT Students Selected for Bharat Forge',
          link: '#',
        },
        {
          heading: 'RIT Dance Club Secures 1st Rank at Vasant Karandak 2026',
          link: '#',
        },
        {
          heading: 'National Qawwali Competition – RIT Takes Top Honors',
          link: '#',
        },
        {
          heading: 'ISTD Islampur Chapter (RIT) Receives ISTD Quality Performance Award 2026',
          link: '#',
        },
      ],
    };

    let newSections;
    if (happeningIdx !== -1) {
      newSections = [...currentSections];
      newSections[happeningIdx] = happeningSection;
    } else {
      newSections = [...currentSections, happeningSection];
    }

    await strapi.documents('api::page.page').update({
      documentId: homePage.documentId,
      data: { sections: newSections },
    });

    await strapi.documents('api::page.page').publish({
      documentId: homePage.documentId,
    });

    strapi.log.info('Happening Now section seeded/updated with 3 events + 4 achievements.');
  } catch (err) {
    strapi.log.warn(`seedHappeningNow error: ${err.message}`);
  }
}

async function seedDiplomas(strapi) {
  try {
    const tableCheck = await strapi.db.connection.raw(
      "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'diplomas')"
    );
    if (!tableCheck.rows[0].exists) {
      strapi.log.warn('diplomas table does not yet exist — skipping diploma seed.');
      return;
    }

    const diplomasData = [
      { name: 'Science & Humanities', slug: 'diploma-sciences-humanities' },
      { name: 'Automobile Engineering', slug: 'diploma-automobile-engineering' },
      { name: 'Civil Engineering', slug: 'diploma-civil-engineering' },
      { name: 'Mechanical Engineering', slug: 'diploma-mechanical-engineering' },
      { name: 'Electrical Engineering', slug: 'diploma-electrical-engineering' },
      { name: 'Computer Engineering', slug: 'diploma-computer-engineering' },
      { name: 'Computer Hardware & Maintenance', slug: 'diploma-computer-hardware-maintenance' },
      { name: 'Mechatronics', slug: 'diploma-mechatronics' },
    ];

    const defaultSections = (name) => [
      {
        __component: 'sections.about-rit',
        eyebrow: 'About the Program',
        heading: `Diploma in ${name}`,
        body: `The Diploma program in ${name} at RIT provides students with a strong foundation in technical knowledge and practical skills. Our experienced faculty and state-of-the-art labs ensure students are well-prepared for industry challenges.`,
        buttonLabel: 'KNOW MORE',
        buttonHref: '#',
      },
      {
        __component: 'sections.hod-message',
        heading: "HOD's Message",
        message: `Welcome to the Department of ${name}. Our dedicated team of faculty members is committed to providing quality education and hands-on experience to our diploma students. We focus on building strong technical fundamentals alongside practical skills.`,
        name: 'Head of Department',
        designation: `HOD, Diploma in ${name}`,
        photo: '',
      },
      {
        __component: 'sections.stats-counter',
        stats: [
          { label: 'Students Enrolled', value: 120, suffix: '+', icon: 'users' },
          { label: 'Faculty Members', value: 8, suffix: '+', icon: 'school' },
          { label: 'Placement Rate', value: 85, suffix: '%', icon: 'briefcase' },
          { label: 'Years Running', value: 10, suffix: '+', icon: 'check' },
        ],
      },
    ];

    for (const diploma of diplomasData) {
      const checkResult = await strapi.db.connection.raw(
        'SELECT id FROM diplomas WHERE slug = ?',
        [diploma.slug]
      );

      if (checkResult.rows.length > 0) {
        strapi.log.info(`Diploma already exists, skipping: ${diploma.name}`);
        continue;
      }

      const crypto = require('crypto');
      const docId = crypto.randomBytes(12).toString('base64url').slice(0, 25);
      const insertResult = await strapi.db.connection.raw(
        'INSERT INTO diplomas (name, slug, description, document_id, locale, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW()) RETURNING id',
        [diploma.name, diploma.slug, `Welcome to the Diploma program in ${diploma.name}.`, docId, 'en']
      );
      const diplomaId = insertResult.rows[0].id;

      const sections = defaultSections(diploma.name);
      let order = 1;

      for (const section of sections) {
        if (section.__component === 'sections.about-rit') {
          const cmpResult = await strapi.db.connection.raw(
            'INSERT INTO components_sections_about_rits (eyebrow, heading, body, button_label, button_href) VALUES (?, ?, ?, ?, ?) RETURNING id',
            [section.eyebrow, section.heading, section.body, section.buttonLabel, section.buttonHref]
          );
          await strapi.db.connection.raw(
            'INSERT INTO diplomas_cmps (entity_id, cmp_id, component_type, field, "order") VALUES (?, ?, ?, ?, ?)',
            [diplomaId, cmpResult.rows[0].id, 'sections.about-rit', 'sections', order]
          );
        } else if (section.__component === 'sections.hod-message') {
          const cmpResult = await strapi.db.connection.raw(
            'INSERT INTO components_sections_hod_messages (heading, name, designation, message) VALUES (?, ?, ?, ?) RETURNING id',
            [section.heading, section.name, section.designation, section.message]
          );
          await strapi.db.connection.raw(
            'INSERT INTO diplomas_cmps (entity_id, cmp_id, component_type, field, "order") VALUES (?, ?, ?, ?, ?)',
            [diplomaId, cmpResult.rows[0].id, 'sections.hod-message', 'sections', order]
          );
        } else if (section.__component === 'sections.stats-counter') {
          const cmpResult = await strapi.db.connection.raw(
            'INSERT INTO components_sections_stats_counters DEFAULT VALUES RETURNING id'
          );
          const statsCounterId = cmpResult.rows[0].id;

          let statOrder = 1;
          for (const stat of section.stats) {
            const statResult = await strapi.db.connection.raw(
              'INSERT INTO components_sections_stat_items (label, value, suffix, icon) VALUES (?, ?, ?, ?) RETURNING id',
              [stat.label, stat.value, stat.suffix, stat.icon]
            );
            await strapi.db.connection.raw(
              'INSERT INTO components_sections_stats_counters_cmps (entity_id, cmp_id, component_type, field, "order") VALUES (?, ?, ?, ?, ?)',
              [statsCounterId, statResult.rows[0].id, 'sections.stat-item', 'stats', statOrder]
            );
            statOrder++;
          }

          await strapi.db.connection.raw(
            'INSERT INTO diplomas_cmps (entity_id, cmp_id, component_type, field, "order") VALUES (?, ?, ?, ?, ?)',
            [diplomaId, statsCounterId, 'sections.stats-counter', 'sections', order]
          );
        }
        order++;
      }

      strapi.log.info(`Diploma seeded: ${diploma.name}`);
    }
  } catch (err) {
    strapi.log.warn(`Diploma seed error: ${err.message}`);
  }
}

async function seedDeptAdminPermissions(strapi) {
  const role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-dept-admin' } });
  if (!role) return;

  // Clear old permissions for this role properly
  const oldPerms = await strapi.db.query('admin::permission').findMany({
    where: { role: role.id }
  });
  for (const p of oldPerms) {
    await strapi.db.query('admin::permission').delete({ where: { id: p.id } });
  }

  const permissions = [
    { action: 'plugin::content-manager.explorer.read', subject: 'api::department.department', conditions: ['admin::is-dept-admin-for-dept'] },
    { action: 'plugin::content-manager.explorer.update', subject: 'api::department.department', conditions: ['admin::is-dept-admin-for-dept'] },
    { action: 'plugin::content-manager.explorer.read', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.update', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.create', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    { action: 'plugin::content-manager.explorer.delete', subject: 'api::page.page', conditions: ['admin::is-dept-admin-for-content'] },
    // Grant plugin access so they can use the content manager
    { action: 'plugin::content-type-builder.read', subject: null },
    { action: 'plugin::upload.read', subject: null },
    { action: 'plugin::upload.assets.create', subject: null },
    { action: 'plugin::upload.assets.update', subject: null },
    { action: 'plugin::upload.assets.download', subject: null },
    { action: 'plugin::upload.assets.copy-link', subject: null },
  ];

  for (const perm of permissions) {
    await strapi.db.query('admin::permission').create({
      data: {
        action: perm.action,
        subject: perm.subject,
        conditions: perm.conditions || [],
        role: role.id,
      }
    });
  }

    strapi.log.info('Seeded permissions for Dept Admin role.');
}

async function seedDiplomaAdminRole(strapi) {
  let role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-diploma-admin' } });
  if (!role) {
    role = await strapi.db.query('admin::role').create({
      data: {
        name: 'Diploma Admin (HOD)',
        code: 'strapi-diploma-admin',
        description: 'Diploma Admin — can only access their own diploma program',
      }
    });
    strapi.log.info('Created Diploma Admin role.');
  }
  return role;
}

async function seedDiplomaAdminUsers(strapi) {
  const bcrypt = require('bcryptjs');
  const role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-diploma-admin' } });
  if (!role) {
    strapi.log.warn('Diploma Admin role not found — skipping diploma admin user seed.');
    return;
  }

  const users = [
    { email: 'diploma-science.hod@ritindia.edu', firstname: 'Dip-Science', lastname: 'HOD', username: 'diploma-science.hod' },
    { email: 'diploma-auto.hod@ritindia.edu', firstname: 'Dip-Auto', lastname: 'HOD', username: 'diploma-auto.hod' },
    { email: 'diploma-civil.hod@ritindia.edu', firstname: 'Dip-Civil', lastname: 'HOD', username: 'diploma-civil.hod' },
    { email: 'diploma-mech.hod@ritindia.edu', firstname: 'Dip-Mech', lastname: 'HOD', username: 'diploma-mech.hod' },
    { email: 'diploma-electrical.hod@ritindia.edu', firstname: 'Dip-Electrical', lastname: 'HOD', username: 'diploma-electrical.hod' },
    { email: 'diploma-cse.hod@ritindia.edu', firstname: 'Dip-CSE', lastname: 'HOD', username: 'diploma-cse.hod' },
    { email: 'diploma-chm.hod@ritindia.edu', firstname: 'Dip-CHM', lastname: 'HOD', username: 'diploma-chm.hod' },
    { email: 'diploma-mechatronics.hod@ritindia.edu', firstname: 'Dip-Mechatronics', lastname: 'HOD', username: 'diploma-mechatronics.hod' },
  ];

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  for (const u of users) {
    const exists = await strapi.db.query('admin::user').findOne({ where: { email: u.email } });
    if (!exists) {
      await strapi.db.query('admin::user').create({
        data: {
          ...u,
          password: passwordHash,
          isActive: true,
          roles: [role.id],
        }
      });
      strapi.log.info(`Created diploma admin user: ${u.email}`);
    } else {
      await strapi.db.query('admin::user').update({
        where: { id: exists.id },
        data: { roles: [role.id] }
      });
    }
  }
}

async function seedAdminDiplomaMappings(strapi) {
  const mappings = [
    { email: 'diploma-science.hod@ritindia.edu', diplomaSlug: 'diploma-sciences-humanities' },
    { email: 'diploma-auto.hod@ritindia.edu', diplomaSlug: 'diploma-automobile-engineering' },
    { email: 'diploma-civil.hod@ritindia.edu', diplomaSlug: 'diploma-civil-engineering' },
    { email: 'diploma-mech.hod@ritindia.edu', diplomaSlug: 'diploma-mechanical-engineering' },
    { email: 'diploma-electrical.hod@ritindia.edu', diplomaSlug: 'diploma-electrical-engineering' },
    { email: 'diploma-cse.hod@ritindia.edu', diplomaSlug: 'diploma-computer-engineering' },
    { email: 'diploma-chm.hod@ritindia.edu', diplomaSlug: 'diploma-computer-hardware-maintenance' },
    { email: 'diploma-mechatronics.hod@ritindia.edu', diplomaSlug: 'diploma-mechatronics' },
  ];

  for (const m of mappings) {
    const user = await strapi.db.query('admin::user').findOne({ where: { email: m.email } });
    const diploma = await strapi.db.query('api::diploma.diploma').findOne({ where: { slug: m.diplomaSlug } });

    if (user && diploma) {
      const exists = await strapi.db.query('api::admin-diploma.admin-diploma').findOne({ where: { admin_user_id: user.id } });
      if (!exists) {
        await strapi.documents('api::admin-diploma.admin-diploma').create({
          data: {
            admin_user_id: user.id,
            admin_email: user.email,
            diploma: diploma.documentId,
          }
        });
        strapi.log.info(`Mapped ${user.email} to ${diploma.name}`);
      }
    }
  }
}

async function seedDiplomaAdminPermissions(strapi) {
  const role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-diploma-admin' } });
  if (!role) return;

  const permissions = [
    { action: 'plugin::content-manager.explorer.read', subject: 'api::diploma.diploma', conditions: ['admin::is-dept-admin-for-diploma'] },
    { action: 'plugin::content-manager.explorer.update', subject: 'api::diploma.diploma', conditions: ['admin::is-dept-admin-for-diploma'] },
    { action: 'plugin::content-manager.explorer.create', subject: 'api::diploma.diploma', conditions: ['admin::is-dept-admin-for-diploma'] },
    { action: 'plugin::content-manager.explorer.delete', subject: 'api::diploma.diploma', conditions: ['admin::is-dept-admin-for-diploma'] },
    { action: 'plugin::upload.read', subject: null },
    { action: 'plugin::upload.assets.create', subject: null },
    { action: 'plugin::upload.assets.update', subject: null },
    { action: 'plugin::upload.assets.download', subject: null },
    { action: 'plugin::upload.assets.copy-link', subject: null },
  ];

  for (const perm of permissions) {
    const existing = await strapi.db.query('admin::permission').findOne({
      where: {
        action: perm.action,
        subject: perm.subject,
        role: role.id,
      }
    });
    if (!existing) {
      await strapi.db.query('admin::permission').create({
        data: {
          action: perm.action,
          subject: perm.subject,
          conditions: perm.conditions || [],
          role: role.id,
        }
      });
      strapi.log.info(`Granted diploma permission: ${perm.action} on ${perm.subject || 'null'}`);
    }
  }
}




