'use strict';

/**
 * Helper: check if user is Super Admin.
 */
const isSuperAdmin = (user) => {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.code === 'strapi-super-admin');
};

/**
 * Helper: check if user is Dept Admin.
 */
const isDeptAdmin = (user) => {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => role.code === 'strapi-dept-admin');
};

/**
 * Helper function to get the department documentId for a user.
 * Returns null for Super Admins (they can access all departments).
 */
const getUserDepartmentId = async (strapi, user) => {
  if (!user) return null;

  if (isSuperAdmin(user)) return null;

  const mapping = await strapi.db.query('api::admin-department.admin-department').findOne({
    where: { admin_user_id: user.id },
    populate: ['department'],
  });

  return mapping?.department?.documentId || null;
};

/**
 * Helper function to check if a user can access a specific department's content.
 */
const checkDepartmentAccess = async (strapi, user, departmentDocumentId) => {
  if (!user) return false;

  if (isSuperAdmin(user)) return true;

  const mapping = await strapi.db.query('api::admin-department.admin-department').findOne({
    where: { admin_user_id: user.id },
    populate: ['department'],
  });

  if (!mapping || !mapping.department) return false;

  return mapping.department.documentId === departmentDocumentId;
};

/**
 * Helper function to get the diploma documentId for a user.
 * Returns null for Super Admins (they can access all diplomas).
 */
const getUserDiplomaId = async (strapi, user) => {
  if (!user) return null;

  if (isSuperAdmin(user)) return null;

  const mapping = await strapi.db.query('api::admin-diploma.admin-diploma').findOne({
    where: { admin_user_id: user.id },
    populate: ['diploma'],
  });

  return mapping?.diploma?.documentId || null;
};

/**
 * Helper function to check if a user can access a specific diploma's content.
 */
const checkDiplomaAccess = async (strapi, user, diplomaDocumentId) => {
  if (!user) return false;

  if (isSuperAdmin(user)) return true;

  const mapping = await strapi.db.query('api::admin-diploma.admin-diploma').findOne({
    where: { admin_user_id: user.id },
    populate: ['diploma'],
  });

  if (!mapping || !mapping.diploma) return false;

  return mapping.diploma.documentId === diplomaDocumentId;
};

module.exports = {
  isSuperAdmin,
  isDeptAdmin,
  getUserDepartmentId,
  checkDepartmentAccess,
  getUserDiplomaId,
  checkDiplomaAccess,
};
