USE `lafilleci`;
SELECT
  (SELECT COUNT(*) FROM `product`) AS produits,
  (SELECT COUNT(*) FROM `Order`) AS commandes,
  (SELECT COUNT(*) FROM `user`) AS utilisateurs;