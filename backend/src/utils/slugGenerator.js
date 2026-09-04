const { prisma } = require('../config/database');

/**
 * Transforms a title into a basic slug
 */
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generates a unique slug for a Project
 * @param {string} title
 * @param {number} [excludeId] - ID to exclude when checking uniqueness (for updates)
 * @returns {Promise<string>}
 */
async function generateUniqueProjectSlug(title, excludeId = null) {
  const baseSlug = slugify(title) || 'project';
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

module.exports = {
  slugify,
  generateUniqueProjectSlug,
};
