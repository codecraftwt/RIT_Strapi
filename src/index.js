'use strict';

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
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

    if (process.env.FORCE_SEED !== 'true') {
      strapi.log.info('Database seeding is disabled. Start the server with FORCE_SEED=true to seed resources.');
      return;
    }

    await seedAdminRoles(strapi);
    await seedAdminUsers(strapi);
    await seedAdminDepartmentMappings(strapi);
    await seedDeptAdminPermissions(strapi);
    await seedHomeSections(strapi);
    
    strapi.log.info('Bootstrap complete — content seeded.');
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
      href: '#',
      dropdown_items: [
        { label: 'Diploma', href: '#' },
        { label: 'Science & Humanities', href: '#' },
        { label: 'Automobile Engineering', href: '#' },
        { label: 'Civil Engineering', href: '#' },
        { label: 'Mechanical Engineering', href: '#' },
        { label: 'Electrical Engineering', href: '#' },
        { label: 'Computer Engineering', href: '#' },
        { label: 'Computer Hardware and Maintenance', href: '#' },
        { label: 'Mechatronics', href: '#' }
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
      __component: 'sections.stats-counter',
      stats: [
        { label: 'Alumni', value: 27000, suffix: '+', icon: 'users' },
        { label: 'Acres Green Campus', value: 43, suffix: '', icon: 'globe' },
        { label: 'Placements in 2024-25', value: 650, suffix: '+', icon: 'briefcase' },
        { label: 'Years of Excellence', value: 43, suffix: '+', icon: 'check' },
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
      __component: 'sections.testimonials',
      heading: 'Our Testimonial',
      items: [
        { name: 'Mrs. Shreya Kale', dept: 'Student', text: 'I fill proud saying, I\'m Alumini of RIT. Its not only an institute who serves technical & practical knowledge but also motivates against social responsibilities. It is an institute where future life enriches with a good spirit.\n\nI\'ve been passed out from RIT, taking a First Class grade in Diploma in Automobile Engineering (2015-2018). The journey with this institute was amazing.' },
        { name: 'Miss. Mohini Vijay Shelake (Batch: 2017-18)', dept: 'Student', text: 'Hello everyone I\'m Mohini Shelake, I have completed my diploma in Civil Engineering Department from Rajarambapu Institute of Technology, Rajaramnagar in year 2018. Now I am pursuing Bachelor in Civil Engineering from reputed institute.\n\nWell RIT is an autonomous Institute and in this institute has excellent & highly qualified faculties. RIT follows outcome based education.' },
        { name: 'Mr. Shahid Yunus Shaikh (Batch: 2019-20)', dept: 'Student', text: 'Hello Everyone I\'m Shahid Yunus Shaikh I have completed my diploma in Civil engineering in 2020 from Rajarambapu Institute of Technology, Rajaramnagar.\n\nI feel very grateful for being passed out from such a highly ranked college in all over India. This Institute has very good and excellent Infrastructure.' },
        { name: 'Ms. Swarali Sunil Kadam', dept: 'Student', text: 'I have completed diploma at RIT, Rajaramanagar in Electrical Engineering 2020-21.\n\nIt was such a great experience! In RIT they have experienced and talented faculty members. They teach us informative knowledge useful in our future studies.' },
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
  ];

  await strapi.documents('api::page.page').update({
    documentId: homePage.documentId,
    data: { sections },
  });

  strapi.log.info(`Home page seeded with ${sections.length} sections.`);
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




