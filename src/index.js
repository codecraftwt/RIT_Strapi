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
        { label: 'Sciences & Humanities', href: '#' },
        { label: 'Robotics and Automation', href: '#' },
        { label: 'Civil Engineering', href: '#' },
        { label: 'Computer Science & Engineering', href: '#' },
        { label: 'Computer Science & Engineering (AI & ML)', href: '#' },
        { label: 'Electrical Engineering', href: '#' },
        { label: 'Electronics and Telecommunication Engineering', href: '#' },
        { label: 'Information Technology', href: '#' },
        { label: 'Mechanical Engineering', href: '#' },
        { label: 'Automobile Engineering (Automotive Technology)', href: '#' },
        { label: 'Mechatronics Engineering', href: '#' },
        { label: 'Department of Management Studies (MBA)', href: '#' },
        { label: 'HVAC Certification Course', href: '#' },
        { label: 'Administrative Wing', href: '#' },
        { label: 'BBA', href: '#' },
        { label: 'Department of Computer Application', href: '#' }
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
    strapi.log.info('Main Navbar already exists — skipping seed.');
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
    const pages = await strapi.db.query('api::page.page').findMany({
      where: { slug },
      populate: { sections: true }
    });

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

      if (!page.sections || page.sections.length === 0) {
        // Strip ids to avoid document relation issues
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
        strapi.log.info(`Page (documentId: ${page.documentId}, slug: ${page.slug}) seeded and published.`);
      } else {
        // Ensure the seeded draft changes are pushed to live published state
        await strapi.documents('api::page.page').publish({
          documentId: page.documentId
        });
        strapi.log.info(`Page (documentId: ${page.documentId}, slug: ${page.slug}) publish verified.`);
      }
    }
  }
}
