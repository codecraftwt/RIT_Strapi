'use strict';

module.exports = {
  register(/* { strapi } */) {},

  async bootstrap({ strapi }) {
    await seedPermissions(strapi);
    await seedHeader(strapi);
    await seedFooter(strapi);
    await seedMainNavbar(strapi);
    await seedPagePermissions(strapi);
    await seedHomePage(strapi);
    await seedDepartments(strapi);
    strapi.log.info('Bootstrap complete — all seeds checked.');
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
  };
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

async function seedHomePage(strapi) {
  const slugs = ['/'];
  for (const slug of slugs) {
    let pages = await strapi.db.query('api::page.page').findMany({
      where: { slug },
      populate: { sections: true }
    });

    if (pages.length === 0) {
      const created = await strapi.documents('api::page.page').create({
        data: {
          title: 'Home',
          slug: '/',
          content: '',
        },
      });
      await strapi.documents('api::page.page').publish({
        documentId: created.documentId,
      });
      strapi.log.info('Home page created and published.');
      pages = await strapi.db.query('api::page.page').findMany({
        where: { slug },
        populate: { sections: true }
      });
    }

    for (const page of pages) {
      let updatedSections = [...(page.sections || [])];

      // 1. Hero Slider
      const heroIndex = updatedSections.findIndex(s => s.__component === 'sections.hero-slider');
      const heroData = {
        __component: 'sections.hero-slider',
        slides: [
          {
            heading: "Discover More Than Just a Degree",
            sub: "Rajarambapu Institute of Technology, Rajaramnagar",
            link: "#",
            videoUrl: "https://www.youtube.com/watch?v=vCNmisSETMc&t=2s"
          },
          {
            heading: "Excellence in Engineering Education",
            sub: "An Empowered Autonomous Institute",
            link: "#"
          },
          {
            heading: "Building Future Leaders",
            sub: "43 Acres of Green Campus",
            link: "#"
          },
          {
            heading: "Where Innovation Meets Education",
            sub: "NAAC & NBA Accredited Programs",
            link: "#"
          }
        ]
      };
      if (heroIndex > -1) {
        updatedSections[heroIndex] = heroData;
      } else {
        updatedSections.push(heroData);
      }

      // 2. Twinning Programs
      const twinningIndex = updatedSections.findIndex(s => s.__component === 'sections.twinning-programs');
      const twinningData = {
        __component: 'sections.twinning-programs',
        eyebrow: "Twinning Programs",
        heading: "TWINNING PROGRAMS AT RIT!",
        description: "Rajarambapu Institute of Technology (RIT) got approval from the Government of India, All India Council for Technical Education (AICTE) to offer extensive twinning programs with esteemed foreign universities from all across the globe. These programs aim to provide students with a global education experience, enhancing their academic and professional capabilities through international exposure.",
        ctaText: "KNOW MORE",
        ctaUrl: "#",
        features: [
          { title: "AICTE", desc: "Approval from the Government of India, All India Council for Technical Education (AICTE).", icon: "star" },
          { title: "FOREIGN UNIVERSITIES", desc: "Offer extensive twinning programs with esteemed foreign universities.", icon: "school" },
          { title: "GLOBAL EDUCATION", desc: "Aim to provide students with a global education experience.", icon: "globe" },
          { title: "INTERNATIONAL EXPOSURE", desc: "Enhancing academic and professional capabilities through international exposure.", icon: "compass" }
        ]
      };
      if (twinningIndex > -1) {
        updatedSections[twinningIndex] = twinningData;
      } else {
        updatedSections.push(twinningData);
      }

      // 3. Placements
      const placementsIndex = updatedSections.findIndex(s => s.__component === 'sections.placements');
      const placementsData = {
        __component: 'sections.placements',
        heading: "PLACEMENT @ 2024-25",
        items: [
          {
            studentName: "MS. SHREYA KHOCHAGE",
            quote: "PROUD MOMENT WITH ISRO - WHERE DREAMS TAKE FLIGHT, AND RIT LIGHTS THE PATH.",
            packageInfo: "6 MONTHS INTERNSHIP AT ISRO",
            companyName: "ISRO",
            companyLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Indian_Space_Research_Organisation_Logo.svg",
            studentPhotoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80"
          },
          {
            studentName: "MS. DISHA SURYAWANSHI",
            quote: "NEXT STOP: CORPORATE WORLD",
            packageInfo: "9 LPA",
            companyName: "Teachnook, Bangalore",
            companyLogoUrl: "",
            studentPhotoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80"
          },
          {
            studentName: "MR. OMPRASAD KANDE",
            quote: "I DREAMED BIG, WORKED HARD, AND GOT PLACED - I DID IT",
            packageInfo: "10 LPA",
            companyName: "Zensar Technologies",
            companyLogoUrl: "",
            studentPhotoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
          },
          {
            studentName: "MS. DIPTI PATIL",
            quote: "FROM RIT TO RELIANCE: MISSION ACCOMPLISHED",
            packageInfo: "7.5 LPA",
            companyName: "Reliance Industries",
            companyLogoUrl: "",
            studentPhotoUrl: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=400&q=80"
          }
        ]
      };
      if (placementsIndex > -1) {
        updatedSections[placementsIndex] = placementsData;
      } else {
        updatedSections.push(placementsData);
      }

      // 4. Notices & Announcements
      const noticesIndex = updatedSections.findIndex(s => s.__component === 'sections.notices-announcements');
      const noticesData = {
        __component: 'sections.notices-announcements',
        noticesTitle: "Notices",
        announcementsTitle: "Announcements",
        notices: [
          { title: "Re-Exam Time Table June-July 2026", date: "19 Jun 2026", link: "#" }
        ],
        announcements: [
          { title: "NIRF Engineering 2025", date: "14 Feb 2025", link: "#" },
          { title: "NIRF Management 2025", date: "14 Feb 2025", link: "#" }
        ]
      };
      if (noticesIndex > -1) {
        updatedSections[noticesIndex] = noticesData;
      } else {
        updatedSections.push(noticesData);
      }

      // 5. Courses
      const coursesIndex = updatedSections.findIndex(s => s.__component === 'sections.courses');
      const coursesSeeded = {
        __component: 'sections.courses',
        heading: "Educate. Empower. Excel.",
        subheading: "Driven Courses",
        categories: [
          {
            name: "Engineering",
            courses: [
              { name: "B. Tech Civil Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Computer Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech AI & ML", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech IT", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Electrical Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Electronics & Tele-communication", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Mechanical", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Mechatronics", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Robotics", duration: "4 Years", campus: "On Campus" },
              { name: "M.Tech Computer Science and Engineering", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Construction Management", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Design Engineering", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Electronics Engineering", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Mechanical Engineering (Thermal Engineering)", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Power Systems and Power Electronics", duration: "2 Years", campus: "On Campus" },
              { name: "M.Tech Structural Engineering", duration: "2 Years", campus: "On Campus" }
            ]
          },
          {
            name: "Diploma",
            courses: [
              { name: "Civil Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Computer Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Electrical Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Mechanical Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Mechatronics", duration: "3 Years", campus: "On Campus" }
            ]
          },
          {
            name: "Computer Application",
            courses: [
              { name: "BCA", duration: "3/4 Years", campus: "On Campus" },
              { name: "MCA", duration: "2 Years", campus: "On Campus" }
            ]
          },
          {
            name: "Management",
            courses: [
              { name: "BBA", duration: "3/4 Years", campus: "On Campus" },
              { name: "MBA", duration: "2 Years", campus: "On Campus" }
            ]
          },
          {
            name: "Twinning Program",
            courses: [
              { name: "B. Tech Mechanical Engineering", duration: "2+2 / 2+3 Years", campus: "On Campus 2 Years (Partner 2/3 Years)" },
              { name: "B. Tech Civil Engineering", duration: "2+2 / 2+3 Years", campus: "On Campus 2 Years (Partner 2/3 Years)" },
              { name: "B. Tech Computer Engineering", duration: "2+2 / 2+3 Years", campus: "On Campus 2 Years (Partner 2/3 Years)" },
              { name: "B. Tech Electrical Engineering", duration: "2+2 / 2+3 Years", campus: "On Campus 2 Years (Partner 2/3 Years)" },
              { name: "B. Tech Electronics & Telecommunication", duration: "2+2 / 2+3 Years", campus: "On Campus 2 Years (Partner 2/3 Years)" },
              { name: "M. Tech Computer Science and Engineering", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M. Tech Design Engineering", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M. Tech Electronics Engineering", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M. Tech Mechanical Engineering (Thermal)", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M. Tech Power Systems and Power Electronics", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M. Tech Structural Engineering", duration: "1+1 Years", campus: "On Campus 1 Year (Partner 1 Year)" },
              { name: "M.B.A", duration: "2 Years", campus: "On Campus" }
            ]
          },
          {
            name: "Working Professional",
            courses: [
              { name: "Diploma Civil Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Diploma Electrical Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "Diploma Mechanical Engineering", duration: "3 Years", campus: "On Campus" },
              { name: "B. Tech Computer Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Electronics and Telecommunication Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "B. Tech Mechanical Engineering", duration: "4 Years", campus: "On Campus" },
              { name: "M. Tech Structural Engineering", duration: "2 Years", campus: "On Campus" },
              { name: "M. Tech Computer Science and Engineering", duration: "2 Years", campus: "On Campus" },
              { name: "M. Tech Power Systems and Power Electronics", duration: "2 Years", campus: "On Campus" }
            ]
          }
        ]
      };

      if (coursesIndex > -1) {
        updatedSections[coursesIndex] = coursesSeeded;
      } else {
        updatedSections.push(coursesSeeded);
      }

      // 6. Why Choose RIT
      const whyChooseIndex = updatedSections.findIndex(s => s.__component === 'sections.why-choose-rit');
      const whyChooseData = {
        __component: 'sections.why-choose-rit',
        heading: 'Why Choose RIT',
        features: [
          { icon: 'laptop',     title: 'NEP',               desc: 'New Education Policy helps to achieve Mastery of Learning' },
          { icon: 'graduation', title: 'Autonomous',         desc: 'Institution delivering 21st Century Skills with an Industry 5.0 ready curriculum for future-ready engineers.' },
          { icon: 'lightbulb',  title: 'RCOFT',              desc: 'RIT Centre for Future Technology to prepare learners for INDUSTRY 5.0 and enhance Employability and Entrepreneurship.' },
          { icon: 'bookOpen',   title: 'Learning by Doing',  desc: 'All subjects are integrated with 50% Practical & Skill Development through PBL & CLAB Class in LAB system.' },
          { icon: 'heart',      title: 'Less is More',       desc: 'RIT adopts the Education for an innovative, effective, and student-centred learning experience.' },
          { icon: 'school',     title: 'RTLC',               desc: 'RIT Teaching Learning Centre provides Learner Centric Environment.' }
        ]
      };
      if (whyChooseIndex > -1) {
        updatedSections[whyChooseIndex] = whyChooseData;
      } else {
        updatedSections.push(whyChooseData);
      }

      // 7. Infocus News
      const infocusIndex = updatedSections.findIndex(s => s.__component === 'sections.infocus-news');
      const infocusData = {
        __component: 'sections.infocus-news',
        infocusTitle: "Infocus",
        newsTitle: "RIT in News",
        infocusItems: [
          {
            title: "आरआयटीचे संचालक डॉ. पी. व्ही. कडळे यांना राष्ट्रीय पातळीवरील एमिनेंट डायरेक्टर पुरस्कार",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmNiM_NmExNDFiNmVhZWFjOA_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "आरआयटीच्या ३३ विद्यार्थ्यांची भारत फोर्जमध्ये निवड",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmQxY_NmEwODQzYmNlYjAyZQ_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "RIT Dance Club Secures 1st Rank at Vasant Karandak 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmQ3Z_NjlmMDM3YzMwOGVkMA_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "National Qawwali Competition",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmY5N_NjlkODdkNDQwNmRiMw_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "RIT Music Club students at National Level – DHANAK 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmZlZ_NjlkODdkZDk0YjIzMQ_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "RIT Dance Club Shines at \"Techbeats 2K26\"",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMzA0O_NjljMjFjZGQwYWZmMg_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "ISTD Islampur Chapter (RIT) Receives ISTD Quality Performance Award 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMzA4Z_NjliMGYxZDEwNmZlYQ_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "1st Rank at Umang 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMzBjZ_Njk5ZDI5NDc2ZDI5Mg_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "Blog Writing Competition at Folk Pravaah State Level Youth Festival 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMzExM_Njk5ZDI5ZDE3ZjU1NA_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "Shivaji University Annual Magazine Competition 2023-24",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMzIzY_Njk4MTgxNWZhZWM0Nw_TM3YWRhNDViZDYzMjJmYjg2Nz"
          }
        ],
        newsItems: [
          {
            title: "आरआयटीच्या ३३ विद्यार्थ्यांची भारत फोर्जमध्ये निवड",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmQxY_NmEwODQzYmNlYjAyZQ_TM3YWRhNDViZDYzMjJmYjg2Nz"
          },
          {
            title: "RIT Dance Club Secures 1st Rank at Vasant Karandak 2026",
            link: "activities_1.php?dsysdfiopwvmzb=mE1YjBhZWNlMmQ3Z_NjlmMDM3YzMwOGVkMA_TM3YWRhNDViZDYzMjJmYjg2Nz"
          }
        ]
      };
      if (infocusIndex > -1) {
        updatedSections[infocusIndex] = infocusData;
      } else {
        updatedSections.push(infocusData);
      }

      // Always strip ids to avoid document relation issues and save updated sections array
      const cleanSections = updatedSections.map(s => {
        const { id, ...rest } = s;
        return rest;
      });

      await strapi.documents('api::page.page').update({
        documentId: page.documentId,
        data: {
          sections: cleanSections
        }
      });

      await strapi.documents('api::page.page').publish({
        documentId: page.documentId
      });
      strapi.log.info(`Page (documentId: ${page.documentId}, slug: ${page.slug}) updated and published.`);
    }
  }
}
async function seedDepartments(strapi) {
  const departmentsData = [
    {
      name: "Sciences & Humanities",
      slug: "sciences-humanities",
      fieldsCount: 5,
      menu_items: [
        {
          label: "About Department",
          dropdown_items: [
            { label: "Overview", href: "#" },
            { label: "Vision & Mission", href: "#" },
            { label: "HOD's Message", href: "#" }
          ]
        },
        {
          label: "Academic Programs",
          dropdown_items: [
            { label: "First Year B.Tech", href: "#" },
            { label: "Curriculum & Syllabus", href: "#" }
          ]
        },
        {
          label: "Faculty",
          dropdown_items: [
            { label: "Faculty Profiles", href: "#" },
            { label: "Staff", href: "#" }
          ]
        },
        {
          label: "Labs & Facilities",
          dropdown_items: [
            { label: "Chemistry Lab", href: "#" },
            { label: "Physics Lab", href: "#" },
            { label: "Language Lab", href: "#" }
          ]
        },
        {
          label: "Contact",
          dropdown_items: [
            { label: "Office Address", href: "#" },
            { label: "Inquiries", href: "#" }
          ]
        }
      ]
    },
    {
      name: "Robotics and Automation",
      slug: "robotics-automation",
      fieldsCount: 6,
      menu_items: [
        { label: "Overview", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "B.Tech Robotics", href: "#" },
            { label: "Syllabus", href: "#" }
          ]
        },
        { label: "Faculty", href: "#" },
        {
          label: "Labs & Projects",
          dropdown_items: [
            { label: "Robotics Lab", href: "#" },
            { label: "Automation Lab", href: "#" }
          ]
        },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Civil Engineering",
      slug: "civil-engineering",
      fieldsCount: 6,
      menu_items: [
        { label: "Overview", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "Undergraduate", href: "#" },
            { label: "Postgraduate", href: "#" }
          ]
        },
        { label: "Faculty Directory", href: "#" },
        {
          label: "Labs & Testing",
          dropdown_items: [
            { label: "Concrete Technology Lab", href: "#" },
            { label: "Testing & Consultancy Services", href: "#" }
          ]
        },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Computer Science & Engineering",
      slug: "computer-science-engineering",
      fieldsCount: 7,
      menu_items: [
        {
          label: "About CSE",
          dropdown_items: [
            { label: "Overview", href: "#" },
            { label: "Vision & Mission", href: "#" },
            { label: "HOD Message", href: "#" }
          ]
        },
        {
          label: "Academics",
          dropdown_items: [
            { label: "B.Tech CSE", href: "#" },
            { label: "M.Tech CSE", href: "#" },
            { label: "Ph.D Program", href: "#" }
          ]
        },
        {
          label: "Faculty Profiles",
          dropdown_items: [
            { label: "Core Faculty", href: "#" },
            { label: "Research Publications", href: "#" }
          ]
        },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "Advanced Computing Lab", href: "#" },
            { label: "Networking Lab", href: "#" },
            { label: "Database Systems Lab", href: "#" }
          ]
        },
        {
          label: "Placements",
          dropdown_items: [
            { label: "Placement Statistics", href: "#" },
            { label: "Our Recruiters", href: "#" }
          ]
        },
        {
          label: "Student Activities",
          dropdown_items: [
            { label: "CSE Association", href: "#" },
            { label: "Hackathons & Events", href: "#" }
          ]
        },
        { label: "Contact Us", href: "#" }
      ]
    },
    {
      name: "Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
      slug: "computer-science-engineering-ai-ml",
      fieldsCount: 7,
      menu_items: [
        { label: "About AI-ML", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "B.Tech AI & ML", href: "#" },
            { label: "Syllabus", href: "#" }
          ]
        },
        { label: "Faculty Directory", href: "#" },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "AI Research Lab", href: "#" },
            { label: "GPU Computing Lab", href: "#" }
          ]
        },
        { label: "Placements", href: "#" },
        { label: "AI & ML Club", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Electrical Engineering",
      slug: "electrical-engineering",
      fieldsCount: 6,
      menu_items: [
        { label: "About EE", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "Curriculum", href: "#" },
            { label: "Programs Offered", href: "#" }
          ]
        },
        { label: "Faculty Directory", href: "#" },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "Power Systems Lab", href: "#" },
            { label: "Electrical Machines Lab", href: "#" }
          ]
        },
        { label: "Placement Records", href: "#" },
        { label: "Contact Us", href: "#" }
      ]
    },
    {
      name: "Electronics and Telecommunication Engineering",
      slug: "electronics-telecommunication-engineering",
      fieldsCount: 6,
      menu_items: [
        { label: "About ENTC", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "B.Tech ENTC", href: "#" },
            { label: "M.Tech ENTC", href: "#" }
          ]
        },
        { label: "Faculty Directory", href: "#" },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "Embedded Systems Lab", href: "#" },
            { label: "Communication Lab", href: "#" }
          ]
        },
        { label: "Placements", href: "#" },
        { label: "Contact Us", href: "#" }
      ]
    },
    {
      name: "Information Technology",
      slug: "information-technology",
      fieldsCount: 6,
      menu_items: [
        { label: "About IT", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "B.Tech IT", href: "#" },
            { label: "Syllabus", href: "#" }
          ]
        },
        { label: "Faculty", href: "#" },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "Web Technology Lab", href: "#" },
            { label: "Cloud Computing Lab", href: "#" }
          ]
        },
        { label: "Placement Statistics", href: "#" },
        { label: "Contact Us", href: "#" }
      ]
    },
    {
      name: "Mechanical Engineering",
      slug: "mechanical-engineering",
      fieldsCount: 8,
      menu_items: [
        {
          label: "About Mechanical",
          dropdown_items: [
            { label: "Overview", href: "#" },
            { label: "Vision & Mission", href: "#" },
            { label: "HOD Message", href: "#" }
          ]
        },
        {
          label: "Academic Programs",
          dropdown_items: [
            { label: "B.Tech Mechanical", href: "#" },
            { label: "M.Tech Design", href: "#" },
            { label: "M.Tech Thermal", href: "#" }
          ]
        },
        { label: "Faculty Profiles", href: "#" },
        {
          label: "Laboratories",
          dropdown_items: [
            { label: "CAD/CAM Center", href: "#" },
            { label: "Thermal Engineering Lab", href: "#" }
          ]
        },
        {
          label: "Projects & Research",
          dropdown_items: [
            { label: "Student Projects", href: "#" },
            { label: "Patents", href: "#" }
          ]
        },
        { label: "Placements & Internships", href: "#" },
        { label: "Alumni Connect", href: "#" },
        { label: "Contact Us", href: "#" }
      ]
    },
    {
      name: "Automobile Engineering (Presently Automotive Technology)",
      slug: "automobile-engineering",
      fieldsCount: 6,
      menu_items: [
        { label: "About Dept", href: "#" },
        { label: "Academics", href: "#" },
        { label: "Faculty Profiles", href: "#" },
        { label: "Automotive Labs", href: "#" },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Mechatronics Engineering",
      slug: "mechatronics-engineering",
      fieldsCount: 6,
      menu_items: [
        { label: "About Dept", href: "#" },
        { label: "Academics", href: "#" },
        { label: "Faculty Profiles", href: "#" },
        { label: "Mechatronics Lab", href: "#" },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Department of Management Studies (MBA)",
      slug: "mba",
      fieldsCount: 6,
      menu_items: [
        { label: "About MBA", href: "#" },
        { label: "Academics", href: "#" },
        { label: "Faculty Profiles", href: "#" },
        { label: "Facilities", href: "#" },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "HVAC Certification Course",
      slug: "hvac-certification-course",
      fieldsCount: 5,
      menu_items: [
        { label: "About Course", href: "#" },
        { label: "Eligibility", href: "#" },
        { label: "Syllabus", href: "#" },
        { label: "Job Opportunities", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Administrative Wing",
      slug: "administrative-wing",
      fieldsCount: 5,
      menu_items: [
        { label: "About Wing", href: "#" },
        { label: "Staff Profiles", href: "#" },
        { label: "Services", href: "#" },
        { label: "Policies", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "BBA",
      slug: "bba",
      fieldsCount: 5,
      menu_items: [
        { label: "About BBA", href: "#" },
        { label: "Eligibility & Fees", href: "#" },
        { label: "Faculty Profiles", href: "#" },
        { label: "Placements", href: "#" },
        { label: "Contact", href: "#" }
      ]
    },
    {
      name: "Department of Computer Application",
      slug: "computer-application",
      fieldsCount: 6,
      menu_items: [
        { label: "About DCA", href: "#" },
        {
          label: "Academics",
          dropdown_items: [
            { label: "BCA Program", href: "#" },
            { label: "MCA Program", href: "#" }
          ]
        },
        { label: "Faculty Directory", href: "#" },
        { label: "Labs & CCF", href: "#" },
        { label: "Placement Statistics", href: "#" },
        { label: "Contact", href: "#" }
      ]
    }
  ];

  for (const dept of departmentsData) {
    // Seed default dynamic sections specifically configured for this department
    let defaultSections = [];
    if (dept.slug === 'sciences-humanities') {
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            { heading: "Sciences & Humanities Department", sub: "Laying the Foundations of Engineering Excellence", link: "#" }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT SCIENCES & HUMANITIES",
          heading: "Bridging Science and Technology",
          body: "The Sciences & Humanities department focuses on building strong fundamental concepts in mathematics, physics, chemistry, and communication skills, preparing first-year B.Tech students for advanced technological challenges.",
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Core Faculty", value: 22, suffix: "+" },
            { label: "Smart Labs", value: 4, suffix: "" },
            { label: "Student Intake", value: 480, suffix: "" }
          ]
        }
      ];
    } else if (dept.slug === 'robotics-automation') {
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            { heading: "Robotics and Automation", sub: "Engineering the Future of Autonomous Systems", link: "#" }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT ROBOTICS & AUTOMATION",
          heading: "Shaping the Industry 5.0 Workforce",
          body: "Our Department of Robotics and Automation integrates mechanical, electrical, and computer engineering principles to design intelligent, autonomous machines capable of transforming industrial automation, aerospace, and medical engineering sectors.",
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Research Labs", value: 6, suffix: "" },
            { label: "Active Patents", value: 8, suffix: "+" },
            { label: "Industry Partners", value: 15, suffix: "+" }
          ]
        }
      ];
    } else if (dept.slug === 'civil-engineering') {
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            { heading: "Civil Engineering Department", sub: "Constructing Sustainable Infrastructure for Tomorrow", link: "#" }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT CIVIL ENGINEERING",
          heading: "Building a Better World",
          body: "Equipping next-generation engineers with skills in structural design, geo-technical investigations, environmental resource management, and intelligent urban planning to drive sustainable societal growth.",
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Faculty Directory", value: 25, suffix: "+" },
            { label: "Consultancy Projects", value: 50, suffix: "+" },
            { label: "Alumni Network", value: 1200, suffix: "+" }
          ]
        }
      ];
    } else if (dept.slug === 'computer-science-engineering') {
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            { heading: "Computer Science & Engineering", sub: "Empowering Innovators for the Digital Frontier", link: "#" }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT COMPUTER SCIENCE & ENGINEERING",
          heading: "Pioneering the Digital Age",
          body: "The CSE Department provides deep training in AI, cybersecurity, software engineering, cloud computing, and high-performance computing, driving student innovation through hackathons and advanced project labs.",
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Intake Count", value: 180, suffix: "" },
            { label: "Hackathons Won", value: 12, suffix: "+" },
            { label: "Highest Package", value: 18, suffix: " LPA" }
          ]
        }
      ];
    } else if (dept.slug === 'electrical-engineering') {
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            { heading: "Electrical Engineering", sub: "Powering Innovation & Renewable Energy Solutions", link: "#" }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT ELECTRICAL ENGINEERING",
          heading: "Energizing the Modern World",
          body: "Focusing on smart grid technologies, energy storage solutions, EV powertrains, and electrical machine designs to empower students to tackle global carbon-neutral energy objectives.",
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Project Labs", value: 8, suffix: "" },
            { label: "Major Grants", value: 5, suffix: "+" },
            { label: "Industry MoUs", value: 12, suffix: "+" }
          ]
        }
      ];
    } else {
      // Generic fallback for other departments
      defaultSections = [
        {
          __component: 'sections.hero-slider',
          slides: [
            {
              heading: `Department of ${dept.name}`,
              sub: "Rajarambapu Institute of Technology",
              link: "#"
            }
          ]
        },
        {
          __component: 'sections.about-content',
          eyebrow: "ABOUT THE DEPARTMENT",
          heading: `Leading Excellence in ${dept.name}`,
          body: `The Department of ${dept.name} at RIT is committed to delivering state-of-the-art education, research, and practical hands-on experience, shaping tomorrow's leaders.`,
          imagePosition: "right"
        },
        {
          __component: 'sections.stats-counter',
          stats: [
            { label: "Faculty Members", value: 15 + dept.fieldsCount, suffix: "+" },
            { label: "Research Labs", value: dept.fieldsCount, suffix: "" },
            { label: "Industry Partners", value: 20 + dept.fieldsCount, suffix: "+" }
          ]
        }
      ];
    }

    const fullMenuItems = [
      { label: "Home", href: "/" },
      ...dept.menu_items
    ];

    const existing = await strapi.db.query('api::department.department').findOne({
      where: { slug: dept.slug },
      populate: { sections: true }
    });

    if (!existing) {
      await strapi.documents('api::department.department').create({
        data: {
          name: dept.name,
          slug: dept.slug,
          description: `Welcome to the official portal of the Department of ${dept.name}.`,
          menu_items: fullMenuItems,
          sections: defaultSections
        }
      });
      strapi.log.info(`Department seeded and published: ${dept.name} (${dept.fieldsCount + 1} navbar items)`);
    } else {
      const updateData = { menu_items: fullMenuItems };
      if (!existing.sections || existing.sections.length === 0) {
        updateData.sections = defaultSections;
      }
      await strapi.documents('api::department.department').update({
        documentId: existing.documentId,
        data: updateData
      });
      strapi.log.info(`Updated existing department ${dept.name} with custom Home link and sections.`);
    }
  }
}

