// import 'package:backend/core/models/restaurant.dart';

/// Represents a restaurant's menu containing categories and items.
class Menu {
  final String id;
  final String restaurantId;
  final List<MenuCategory> categories;
  final DateTime createdAt;
  final DateTime updatedAt;

  Menu({
    required this.id,
    required this.restaurantId,
    required this.categories,
    required this.createdAt,
    required this.updatedAt,
  });

  /// Creates a copy of this menu with updated fields.
  Menu copyWith({
    String? id,
    String? restaurantId,
    List<MenuCategory>? categories,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Menu(
      id: id ?? this.id,
      restaurantId: restaurantId ?? this.restaurantId,
      categories: categories ?? this.categories,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is Menu &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          restaurantId == other.restaurantId &&
          categories == other.categories &&
          createdAt == other.createdAt &&
          updatedAt == other.updatedAt;

  @override
  int get hashCode =>
      id.hashCode ^
      restaurantId.hashCode ^
      categories.hashCode ^
      createdAt.hashCode ^
      updatedAt.hashCode;
}

/// Represents a category inside a menu (e.g., "Pizzas", "Drinks").
class MenuCategory {
  final String id;
  final String name;
  final String description;
  final List<MenuItem> items;

  MenuCategory({
    required this.id,
    required this.name,
    required this.description,
    required this.items,
  });

  MenuCategory copyWith({
    String? id,
    String? name,
    String? description,
    List<MenuItem>? items,
  }) {
    return MenuCategory(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      items: items ?? this.items,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MenuCategory &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          items == other.items;

  @override
  int get hashCode =>
      id.hashCode ^ name.hashCode ^ description.hashCode ^ items.hashCode;
}

/// Represents a single menu item (e.g., "Margherita Pizza").
class MenuItem {
  final String id;
  final String name;
  final String description;
  final double price;
  final bool available;

  MenuItem({
    required this.id,
    required this.name,
    required this.description,
    required this.price,
    required this.available,
  });

  MenuItem copyWith({
    String? id,
    String? name,
    String? description,
    double? price,
    bool? available,
  }) {
    return MenuItem(
      id: id ?? this.id,
      name: name ?? this.name,
      description: description ?? this.description,
      price: price ?? this.price,
      available: available ?? this.available,
    );
  }

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is MenuItem &&
          runtimeType == other.runtimeType &&
          id == other.id &&
          name == other.name &&
          description == other.description &&
          price == other.price &&
          available == other.available;

  @override
  int get hashCode =>
      id.hashCode ^
      name.hashCode ^
      description.hashCode ^
      price.hashCode ^
      available.hashCode;
}

