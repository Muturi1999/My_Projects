part of 'post_bloc.dart';
// import 'package:equatable/equatable.dart';

sealed class PostEvent extends Equatable {
  @override
  List<Object> get props => [];
}

final class PostFetched extends PostEvent {}