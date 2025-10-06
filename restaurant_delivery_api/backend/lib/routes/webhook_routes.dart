// // ignore_for_file: use_function_type_syntax_for_parameters

// import 'package:shelf/shelf.dart';

// router.get('/webhooks', (Request req) async {
//   final webhookRepo = WebhookRepository(db); // inject your DB connection
//   final events = await webhookRepo.getAllEvents();
//   return Response.ok(jsonEncode({'data': events}),
//     headers: {'Content-Type': 'application/json'});
// });
