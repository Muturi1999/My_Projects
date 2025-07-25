import 'package:flutter/material.dart';
import 'package:flutter_counter/counter/counter.dart';
import 'package:flutter_counter/counter/view/counter_page.dart' show CounterPage;

/// {@template counter_app}
/// A [MaterialApp] which sets the `home` to [CounterPage].
/// {@endtemplate}
class CounterApp extends MaterialApp {
  /// {@macro counter_app}
  const CounterApp({super.key}) : super(home: const CounterPage());
}