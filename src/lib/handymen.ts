import { prisma } from "@/lib/db";
import { categories } from "@/data/categories";

export type Filters = {
  q?: string;
  category?: string;
  sub?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  vip?: boolean;
};

export type HandymanListing = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  categoryId: string;
  subcategories: string[];
  portfolio: string[];
  city: string;
  bio: string | null;
  photoUrl: string | null;
  price: number;
  isVip: boolean;
};

function listing(row: {
  id: string;
  userId: string;
  categoryId: string;
  subcategories: { subcategoryId: string }[];
  portfolio: { url: string }[];
  city: string;
  bio: string | null;
  photoUrl: string | null;
  price: number;
  isVip: boolean;
  user: { firstName: string; lastName: string };
}): HandymanListing {
  return {
    id: row.id,
    userId: row.userId,
    firstName: row.user.firstName,
    lastName: row.user.lastName,
    categoryId: row.categoryId,
    subcategories: row.subcategories.map((s) => s.subcategoryId),
    portfolio: row.portfolio.map((p) => p.url),
    city: row.city,
    bio: row.bio,
    photoUrl: row.photoUrl,
    price: row.price,
    isVip: row.isVip,
  };
}

export async function searchHandymen(filters: Filters = {}): Promise<HandymanListing[]> {
  const q = filters.q?.trim();
  const searchTerms = q?.split(/\s+/).filter(Boolean) ?? [];
  const rows = await prisma.handymanProfile.findMany({
    where: {
      ...(filters.category ? { categoryId: filters.category } : {}),
      ...(filters.sub ? { subcategories: { some: { subcategoryId: { contains: filters.sub, mode: "insensitive" as const } } } } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.vip !== undefined ? { isVip: filters.vip } : {}),
      ...(filters.minPrice !== undefined || filters.maxPrice !== undefined
        ? {
            price: {
              ...(filters.minPrice !== undefined ? { gte: filters.minPrice } : {}),
              ...(filters.maxPrice !== undefined ? { lte: filters.maxPrice } : {}),
            },
          }
        : {}),
      ...(searchTerms.length
        ? {
            AND: searchTerms.map((term) => {
              const matchingCategoryIds = categories
                .filter((category) =>
                  category.id.toLowerCase().includes(term.toLowerCase()) ||
                  category.name.en.toLowerCase().includes(term.toLowerCase()) ||
                  category.name.ka.toLowerCase().includes(term.toLowerCase())
                )
                .map((category) => category.id);
              return {
                OR: [
                  { user: { firstName: { contains: term, mode: "insensitive" as const } } },
                  { user: { lastName: { contains: term, mode: "insensitive" as const } } },
                  { subcategories: { some: { subcategoryId: { contains: term, mode: "insensitive" as const } } } },
                  { categoryId: { in: matchingCategoryIds } },
                  { city: { contains: term, mode: "insensitive" as const } },
                ],
              };
            }),
          }
        : {}),
    },
    include: { user: { select: { firstName: true, lastName: true } }, subcategories: true, portfolio: true },
    orderBy: [{ isVip: "desc" }, { price: "asc" }],
    take: 100,
  });

  return rows.map(listing);
}

export async function getFeaturedHandymen(limit = 4): Promise<HandymanListing[]> {
  const rows = await prisma.handymanProfile.findMany({
    where: { isVip: true },
    include: { user: { select: { firstName: true, lastName: true } }, subcategories: true, portfolio: true },
    orderBy: { price: "asc" },
    take: limit,
  });
  return rows.map(listing);
}

export async function getHandyman(id: string): Promise<HandymanListing | null> {
  const row = await prisma.handymanProfile.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: { user: { select: { firstName: true, lastName: true } }, subcategories: true, portfolio: true },
  });
  return row ? listing(row) : null;
}
