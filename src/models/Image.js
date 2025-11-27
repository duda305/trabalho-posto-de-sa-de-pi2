import prisma from '../database/database.js';
 
async function create({ userId, path }) {
  const newImage = await prisma.image.create({
    data: {
      path,
      user: {
        connect: {
          id: usuarioId,
        },
      },
    },
  });
 
  return newImage;
}
 
async function update({ usuarioId, path }) {
  const newImage = await prisma.image.update({
    where: {
      usuarioId,
    },
    data: {
      path,
      user: {
        connect: {
          id: usuarioId,
        },
      },
    },
  });
 
  return newImage;
}
 
export default { create, update };
 