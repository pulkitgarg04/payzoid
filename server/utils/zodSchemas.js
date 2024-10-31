import zod from 'zod';

export const signUpSchema = zod.object({
  email: zod.string().email().max(30),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string(),
});

export const signinSchema = zod.object({
  email: zod.string().email(),
  password: zod.string(),
});

export const updateUserSchema = zod.object({
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
  phone: zod.string().optional(),
  gender: zod.string().optional(),
  bio: zod.string().optional(),
  country: zod.string().optional(),
  city: zod.string().optional(),
  postalcode: zod.string().optional(),
  taxid: zod.string().optional(),
});