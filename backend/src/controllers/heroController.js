import prisma from '../config/database.js';
import { successResponse } from '../utils/apiResponse.js';

/**
 * Get Hero Section
 * GET /api/hero
 */
export const getHero = async (req, res) => {
  let hero = await prisma.hero.findFirst();

  if (!hero) {
    hero = await prisma.hero.create({
      data: {
        greeting: "HELLO, I'M",
        roleTitle: 'Web Developer',
        tagline: 'Engineering robust frontend experiences and scalable backend services.',
        description: 'Specializing in React, Node.js, Express, MySQL, and modern web application development.',
        primaryBtnText: 'View My Work',
        primaryBtnLink: '#projects',
        secondaryBtnText: "Let's Talk",
        secondaryBtnLink: '#contact',
        talkLinkText: "Let's Talk",
        resumeBtnText: 'Download Resume',
        isActive: true,
      },
    });
  }

  return successResponse(res, 200, 'Hero section retrieved', hero);
};

/**
 * Update Hero Section
 * PUT /api/hero
 */
export const updateHero = async (req, res) => {
  let hero = await prisma.hero.findFirst();
  const updateData = { ...req.body };

  delete updateData.id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  let updated;
  if (hero) {
    updated = await prisma.hero.update({
      where: { id: hero.id },
      data: updateData,
    });
  } else {
    updated = await prisma.hero.create({
      data: updateData,
    });
  }

  return successResponse(res, 200, 'Hero section updated successfully', updated);
};

export default {
  getHero,
  updateHero,
};
