const { prisma } = require('../config/database');
const { successResponse } = require('../utils/apiResponse');

/**
 * Helper to get or create singleton Hero
 */
async function getOrCreateHero() {
  let hero = await prisma.hero.findFirst();
  if (!hero) {
    hero = await prisma.hero.create({
      data: {
        title: "HELLO, I'M",
        subtitle: 'Dhanush M',
        description: 'Web Developer / Full Stack Developer',
        primaryButtonText: 'View My Work',
        primaryButtonUrl: '#projects',
        secondaryButtonText: "Let's Talk",
        secondaryButtonUrl: '#contact',
        isActive: true,
      },
    });
  }
  return hero;
}

/**
 * Get Hero section
 * GET /api/hero
 */
async function getHero(req, res) {
  const hero = await getOrCreateHero();
  return successResponse(res, hero, 'Hero section retrieved successfully');
}

/**
 * Update Hero section
 * PUT /api/hero
 */
async function updateHero(req, res) {
  const existing = await getOrCreateHero();

  const allowedFields = [
    'title',
    'subtitle',
    'description',
    'primaryButtonText',
    'primaryButtonUrl',
    'secondaryButtonText',
    'secondaryButtonUrl',
    'isActive',
  ];

  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  const updatedHero = await prisma.hero.update({
    where: { id: existing.id },
    data: updateData,
  });

  return successResponse(res, updatedHero, 'Hero section updated successfully');
}

module.exports = {
  getHero,
  updateHero,
};
