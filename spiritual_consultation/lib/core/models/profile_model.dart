class Profile {
  final String id;
  final String fullName;
  final String? avatarUrl;
  final String? bio;
  final String? phone;
  final bool isAdmin; 

  Profile({
    required this.id,
    required this.fullName,
    this.avatarUrl,
    this.bio,
    this.phone,
    this.isAdmin = false,
  });

  factory Profile.fromMap(Map<String, dynamic> map) {
    return Profile(
      id: map['id']?.toString() ?? '',
      fullName: map['full_name']?.toString() ?? 'مستخدم BioPara',
      avatarUrl: map['avatar_url']?.toString(),
      bio: map['bio']?.toString(),
      phone: map['phone']?.toString(),
      isAdmin: map['is_admin'] == true,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'full_name': fullName,
      'avatar_url': avatarUrl,
      'bio': bio,
      'phone': phone,
      'is_admin': isAdmin,
    };
  }
}
