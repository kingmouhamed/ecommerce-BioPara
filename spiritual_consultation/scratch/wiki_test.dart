// ignore_for_file: avoid_print
import 'package:http/http.dart' as http;

Future<void> main() async {
  const query = 'يانسون';
  final url = Uri.parse('https://ar.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=$query&format=json&pithumbsize=400');
  
  final response = await http.get(url);
  print(response.body);
}
