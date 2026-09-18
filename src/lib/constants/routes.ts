export const ROUTES = {
  home: "/",
  gym: "/gym",
  gymProgress: (exerciseId: string) => `/gym/progress/${exerciseId}`,
  nutrition: "/nutrition",
} as const;
