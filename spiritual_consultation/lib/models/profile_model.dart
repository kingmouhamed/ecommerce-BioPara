class Profile {
  final String id;
  final String fullName;
  final String? avatarUrl;
  final String? bio;
  final String? phone;

  Profile({
    required this.id,
    required this.fullName,
    this.avatarUrl,
    this.bio,
    this.phone,
  });

  factory Profile.fromMap(Map<String, dynamic> map) {
    return Profile(
      id: map['id']?.toString() ?? '',
      fullName: map['full_name']?.toString() ?? 'مستخدم جديد',
      avatarUrl: map['avatar_url']?.toString(),
      bio: map['bio']?.toString(),
      phone: map['phone']?.toString(),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'bio': bio,
      'phone': phone,
    };
  }
}
