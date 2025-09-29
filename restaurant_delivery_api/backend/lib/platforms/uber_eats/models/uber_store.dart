// // class UberStore {
// //   final String id;
// //   final String name;
// //   final String externalStoreId;
// //   final UberStoreLocation location;
// //   final String status; // 'ONLINE', 'PAUSED', 'OFFLINE'
// //   final UberStoreHours? regularHours;
// //   final List<UberHolidayHours> holidayHours;
// //   final UberPosIntegration? posIntegration;

// //   UberStore({
// //     required this.id,
// //     required this.name,
// //     required this.externalStoreId,
// //     required this.location,
// //     required this.status,
// //     this.regularHours,
// //     this.holidayHours = const [],
// //     this.posIntegration,
// //   });

// //   factory UberStore.fromJson(Map<String, dynamic> json) {
// //     return UberStore(
// //       id: json['id'],
// //       name: json['name'],
// //       externalStoreId: json['external_store_id'] ?? '',
// //       location: UberStoreLocation.fromJson(json['location']),
// //       status: json['status'] ?? 'OFFLINE',
// //       regularHours: json['hours'] != null ? UberStoreHours.fromJson(json['hours']) : null,
// //       holidayHours: (json['holiday_hours'] as List? ?? [])
// //           .map((h) => UberHolidayHours.fromJson(h)).toList(),
// //       posIntegration: json['pos_integration'] != null 
// //           ? UberPosIntegration.fromJson(json['pos_integration']) 
// //           : null,
// //     );
// //   }

// //   Map<String, dynamic> toJson() => {
// //     'id': id,
// //     'name': name,
// //     'external_store_id': externalStoreId,
// //     'location': location.toJson(),
// //     'status': status,
// //     'hours': regularHours?.toJson(),
// //     'holiday_hours': holidayHours.map((h) => h.toJson()).toList(),
// //     'pos_integration': posIntegration?.toJson(),
// //   };
// // }

// // class UberStoreLocation {
// //   final String address;
// //   final String city;
// //   final String state;
// //   final String postalCode;
// //   final String country;
// //   final double? latitude;
// //   final double? longitude;

// //   UberStoreLocation({
// //     required this.address,
// //     required this.city,
// //     required this.state,
// //     required this.postalCode,
// //     required this.country,
// //     this.latitude,
// //     this.longitude,
// //   });

// //   factory UberStoreLocation.fromJson(Map<String, dynamic> json) {
// //     return UberStoreLocation(
// //       address: json['address'] ?? '',
// //       city: json['city'] ?? '',
// //       state: json['state'] ?? '',
// //       postalCode: json['postal_code'] ?? '',
// //       country: json['country'] ?? '',
// //       latitude: json['latitude']?.toDouble(),
// //       longitude: json['longitude']?.toDouble(),
// //     );
// //   }

// //   Map<String, dynamic> toJson() => {
// //     'address': address,
// //     'city': city,
// //     'state': state,
// //     'postal_code': postalCode,
// //     'country': country,
// //     'latitude': latitude,
// //     'longitude': longitude,
// //   };
// // }

// // class UberHolidayHours {
// //   final String date; // YYYY-MM-DD format
// //   final String? openTime; // HH:MM format
// //   final String? closeTime; // HH:MM format
// //   final bool isClosed;

// //   UberHolidayHours({
// //     required this.date,
// //     this.openTime,
// //     this.closeTime,
// //     this.isClosed = false,
// //   });

// //   factory UberHolidayHours.fromJson(Map<String, dynamic> json) {
// //     return UberHolidayHours(
// //       date: json['date'],
// //       openTime: json['open_time'],
// //       closeTime: json['close_time'],
// //       isClosed: json['is_closed'] ?? false,
// //     );
// //   }

// //   Map<String, dynamic> toJson() => {
// //     'date': date,
// //     'open_time': openTime,
// //     'close_time': closeTime,
// //     'is_closed': isClosed,
// //   };
// // }

// // class UberPosIntegration {
// //   final String integratorStoreId;
// //   final String? merchantStoreId;
// //   final bool isOrderManager;
// //   final bool integrationEnabled;
// //   final String? storeConfigurationData;

// //   UberPosIntegration({
// //     required this.integratorStoreId,
// //     this.merchantStoreId,
// //     required this.isOrderManager,
// //     required this.integrationEnabled,
// //     this.storeConfigurationData,
// //   });

// //   factory UberPosIntegration.fromJson(Map<String, dynamic> json) {
// //     return UberPosIntegration(
// //       integratorStoreId: json['integrator_store_id'],
// //       merchantStoreId: json['merchant_store_id'],
// //       isOrderManager: json['is_order_manager'] ?? false,
// //       integrationEnabled: json['integration_enabled'] ?? false,
// //       storeConfigurationData: json['store_configuration_data'],
// //     );
// //   }

// //   Map<String, dynamic> toJson() => {
// //     'integrator_store_id': integratorStoreId,
// //     'merchant_store_id': merchantStoreId,
// //     'is_order_manager': isOrderManager,
// //     'integration_enabled': integrationEnabled,
// //     'store_configuration_data': storeConfigurationData,
// //   };

// // }

// class UberStore {
//   final String id;
//   final String name;
//   final String externalStoreId;
//   final UberStoreLocation location;
//   final String status; // 'ONLINE', 'PAUSED', 'OFFLINE'
//   final UberStoreHours? regularHours;
//   final List<UberHolidayHours> holidayHours;
//   final UberPosIntegration? posIntegration;

//   UberStore({
//     required this.id,
//     required this.name,
//     required this.externalStoreId,
//     required this.location,
//     required this.status,
//     this.regularHours,
//     this.holidayHours = const [],
//     this.posIntegration,
//   });

//   factory UberStore.fromJson(Map<String, dynamic> json) {
//     return UberStore(
//       id: json['id'],
//       name: json['name'],
//       externalStoreId: json['external_store_id'] ?? '',
//       location: UberStoreLocation.fromJson(json['location']),
//       status: json['status'] ?? 'OFFLINE',
//       regularHours: json['hours'] != null ? UberStoreHours.fromJson(json['hours']) : null,
//       holidayHours: (json['holiday_hours'] as List? ?? [])
//           .map((h) => UberHolidayHours.fromJson(h)).toList(),
//       posIntegration: json['pos_integration'] != null 
//           ? UberPosIntegration.fromJson(json['pos_integration']) 
//           : null,
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'id': id,
//     'name': name,
//     'external_store_id': externalStoreId,
//     'location': location.toJson(),
//     'status': status,
//     'hours': regularHours?.toJson(),
//     'holiday_hours': holidayHours.map((h) => h.toJson()).toList(),
//     'pos_integration': posIntegration?.toJson(),
//   };
// }

// class UberStoreLocation {
//   final String address;
//   final String city;
//   final String state;
//   final String postalCode;
//   final String country;
//   final double? latitude;
//   final double? longitude;

//   UberStoreLocation({
//     required this.address,
//     required this.city,
//     required this.state,
//     required this.postalCode,
//     required this.country,
//     this.latitude,
//     this.longitude,
//   });

//   factory UberStoreLocation.fromJson(Map<String, dynamic> json) {
//     return UberStoreLocation(
//       address: json['address'] ?? '',
//       city: json['city'] ?? '',
//       state: json['state'] ?? '',
//       postalCode: json['postal_code'] ?? '',
//       country: json['country'] ?? '',
//       latitude: json['latitude']?.toDouble(),
//       longitude: json['longitude']?.toDouble(),
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'address': address,
//     'city': city,
//     'state': state,
//     'postal_code': postalCode,
//     'country': country,
//     'latitude': latitude,
//     'longitude': longitude,
//   };
// }

// class UberHolidayHours {
//   final String date; // YYYY-MM-DD format
//   final String? openTime; // HH:MM format
//   final String? closeTime; // HH:MM format
//   final bool isClosed;

//   UberHolidayHours({
//     required this.date,
//     this.openTime,
//     this.closeTime,
//     this.isClosed = false,
//   });

//   factory UberHolidayHours.fromJson(Map<String, dynamic> json) {
//     return UberHolidayHours(
//       date: json['date'],
//       openTime: json['open_time'],
//       closeTime: json['close_time'],
//       isClosed: json['is_closed'] ?? false,
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'date': date,
//     'open_time': openTime,
//     'close_time': closeTime,
//     'is_closed': isClosed,
//   };
// }

// class UberPosIntegration {
//   final String integratorStoreId;
//   final String? merchantStoreId;
//   final bool isOrderManager;
//   final bool integrationEnabled;
//   final String? storeConfigurationData;

//   UberPosIntegration({
//     required this.integratorStoreId,
//     this.merchantStoreId,
//     required this.isOrderManager,
//     required this.integrationEnabled,
//     this.storeConfigurationData,
//   });

//   factory UberPosIntegration.fromJson(Map<String, dynamic> json) {
//     return UberPosIntegration(
//       integratorStoreId: json['integrator_store_id'],
//       merchantStoreId: json['merchant_store_id'],
//       isOrderManager: json['is_order_manager'] ?? false,
//       integrationEnabled: json['integration_enabled'] ?? false,
//       storeConfigurationData: json['store_configuration_data'],
//     );
//   }

//   Map<String, dynamic> toJson() => {
//     'integrator_store_id': integratorStoreId,
//     'merchant_store_id': merchantStoreId,
//     'is_order_manager': isOrderManager,
//     'integration_enabled': integrationEnabled,
//     'store_configuration_data': storeConfigurationData,
//   };
// }

class UberStore {
  final String id;
  final String name;
  final String externalStoreId;
  final UberStoreLocation location;
  final String status; // 'ONLINE', 'PAUSED', 'OFFLINE'
  final UberStoreHours? regularHours;
  final List<UberHolidayHours> holidayHours;
  final UberPosIntegration? posIntegration;

  UberStore({
    required this.id,
    required this.name,
    required this.externalStoreId,
    required this.location,
    required this.status,
    this.regularHours,
    this.holidayHours = const [],
    this.posIntegration,
  });

  factory UberStore.fromJson(Map<String, dynamic> json) {
    return UberStore(
      id: json['id'],
      name: json['name'],
      externalStoreId: json['external_store_id'] ?? '',
      location: UberStoreLocation.fromJson(json['location']),
      status: json['status'] ?? 'OFFLINE',
      regularHours: json['hours'] != null ? UberStoreHours.fromJson(json['hours']) : null,
      holidayHours: (json['holiday_hours'] as List? ?? [])
          .map((h) => UberHolidayHours.fromJson(h)).toList(),
      posIntegration: json['pos_integration'] != null 
          ? UberPosIntegration.fromJson(json['pos_integration']) 
          : null,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'external_store_id': externalStoreId,
    'location': location.toJson(),
    'status': status,
    'hours': regularHours?.toJson(),
    'holiday_hours': holidayHours.map((h) => h.toJson()).toList(),
    'pos_integration': posIntegration?.toJson(),
  };
}

class UberStoreLocation {
  final String address;
  final String city;
  final String state;
  final String postalCode;
  final String country;
  final double? latitude;
  final double? longitude;

  UberStoreLocation({
    required this.address,
    required this.city,
    required this.state,
    required this.postalCode,
    required this.country,
    this.latitude,
    this.longitude,
  });

  factory UberStoreLocation.fromJson(Map<String, dynamic> json) {
    return UberStoreLocation(
      address: json['address'] ?? '',
      city: json['city'] ?? '',
      state: json['state'] ?? '',
      postalCode: json['postal_code'] ?? '',
      country: json['country'] ?? '',
      latitude: json['latitude']?.toDouble(),
      longitude: json['longitude']?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() => {
    'address': address,
    'city': city,
    'state': state,
    'postal_code': postalCode,
    'country': country,
    'latitude': latitude,
    'longitude': longitude,
  };
}

class UberHolidayHours {
  final String date; // YYYY-MM-DD format
  final String? openTime; // HH:MM format
  final String? closeTime; // HH:MM format
  final bool isClosed;

  UberHolidayHours({
    required this.date,
    this.openTime,
    this.closeTime,
    this.isClosed = false,
  });

  factory UberHolidayHours.fromJson(Map<String, dynamic> json) {
    return UberHolidayHours(
      date: json['date'],
      openTime: json['open_time'],
      closeTime: json['close_time'],
      isClosed: json['is_closed'] ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
    'date': date,
    'open_time': openTime,
    'close_time': closeTime,
    'is_closed': isClosed,
  };
}

class UberPosIntegration {
  final String integratorStoreId;
  final String? merchantStoreId;
  final bool isOrderManager;
  final bool integrationEnabled;
  final String? storeConfigurationData;

  UberPosIntegration({
    required this.integratorStoreId,
    this.merchantStoreId,
    required this.isOrderManager,
    required this.integrationEnabled,
    this.storeConfigurationData,
  });

  factory UberPosIntegration.fromJson(Map<String, dynamic> json) {
    return UberPosIntegration(
      integratorStoreId: json['integrator_store_id'],
      merchantStoreId: json['merchant_store_id'],
      isOrderManager: json['is_order_manager'] ?? false,
      integrationEnabled: json['integration_enabled'] ?? false,
      storeConfigurationData: json['store_configuration_data'],
    );
  }

  Map<String, dynamic> toJson() => {
    'integrator_store_id': integratorStoreId,
    'merchant_store_id': merchantStoreId,
    'is_order_manager': isOrderManager,
    'integration_enabled': integrationEnabled,
    'store_configuration_data': storeConfigurationData,
  };
}