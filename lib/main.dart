import 'package:flutter/material.dart';

void main() => runApp(const LymoqApp());

class LymoqApp extends StatelessWidget {
  const LymoqApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'LYMOQ',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: LymoqColors.background,
        colorScheme: ColorScheme.fromSeed(seedColor: LymoqColors.forest),
      ),
      home: const OnboardingScreen(),
    );
  }
}

class LymoqColors {
  static const forest = Color(0xFF073D31);
  static const forest2 = Color(0xFF005C47);
  static const accent = Color(0xFF008566);
  static const mint = Color(0xFFE8F6EF);
  static const mintStrong = Color(0xFFCDEEDF);
  static const background = Color(0xFFF9FBF8);
  static const surface = Colors.white;
  static const text = Color(0xFF111815);
  static const muted = Color(0xFF6F7C76);
  static const border = Color(0xFFE3EAE6);
  static const success = Color(0xFF18936C);
  static const danger = Color(0xFFD45454);
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final size = MediaQuery.sizeOf(context);
    final cardWidth = (size.width * .70).clamp(250.0, 310.0);
    final cardHeight = cardWidth * .62;

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(26, 14, 26, 20),
              child: ConstrainedBox(
                constraints: BoxConstraints(minHeight: constraints.maxHeight - 34),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _OnboardingHeader(),
                    const SizedBox(height: 18),
                    const Text(
                      'Your money.\nYour rules.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: LymoqColors.text,
                        fontSize: 30,
                        height: .96,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -1.2,
                      ),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      'Create secure virtual cards\nfor your online payments.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: LymoqColors.muted,
                        fontSize: 14,
                        height: 1.25,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 18),
                    SizedBox(
                      height: cardHeight + 66,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Transform.translate(
                            offset: const Offset(-28, 12),
                            child: Transform.rotate(
                              angle: -.17,
                              child: Container(
                                width: cardWidth * .86,
                                height: cardHeight * .86,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFBFE8D6),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                          ),
                          Transform.translate(
                            offset: const Offset(26, -2),
                            child: Transform.rotate(
                              angle: .08,
                              child: Container(
                                width: cardWidth * .88,
                                height: cardHeight * .88,
                                decoration: BoxDecoration(
                                  color: const Color(0xFFDDF3E9),
                                  borderRadius: BorderRadius.circular(20),
                                ),
                              ),
                            ),
                          ),
                          Transform.rotate(
                            angle: -.12,
                            child: _VirtualCard(
                              width: cardWidth,
                              height: cardHeight,
                              showMerchant: false,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    const _Benefit(icon: Icons.lock_outline_rounded, text: 'Spend online safely'),
                    const _Benefit(icon: Icons.tune_rounded, text: 'Stay in control'),
                    const _Benefit(icon: Icons.speed_rounded, text: 'Set your own limits'),
                    const _Benefit(icon: Icons.public_rounded, text: 'Built for Africa'),
                    const SizedBox(height: 16),
                    SizedBox(
                      height: 52,
                      child: FilledButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute<void>(builder: (_) => const HomeScreen()),
                          );
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: LymoqColors.forest2,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Get started', style: TextStyle(fontWeight: FontWeight.w800)),
                            SizedBox(width: 12),
                            Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute<void>(builder: (_) => const HomeScreen()),
                        );
                      },
                      child: const Text(
                        'I already have an account',
                        style: TextStyle(color: LymoqColors.forest, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),
    );
  }
}

class _OnboardingHeader extends StatelessWidget {
  const _OnboardingHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        const Text(
          'LYMOQ',
          style: TextStyle(
            color: LymoqColors.forest,
            fontSize: 22,
            fontWeight: FontWeight.w900,
            letterSpacing: 1.2,
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 7),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [BoxShadow(color: Color(0x10000000), blurRadius: 10, offset: Offset(0, 4))],
          ),
          child: const Row(
            children: [
              Text('EN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
              SizedBox(width: 4),
              Icon(Icons.keyboard_arrow_down_rounded, size: 16),
            ],
          ),
        ),
      ],
    );
  }
}

class _Benefit extends StatelessWidget {
  const _Benefit({required this.icon, required this.text});
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Row(
        children: [
          Container(
            width: 30,
            height: 30,
            decoration: const BoxDecoration(color: LymoqColors.forest2, shape: BoxShape.circle),
            child: Icon(icon, size: 16, color: Colors.white),
          ),
          const SizedBox(width: 12),
          Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
        ],
      ),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LymoqColors.background,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 14, 20, 22),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _HomeHeader(),
              const SizedBox(height: 14),
              const _HeroPanel(),
              const SizedBox(height: 14),
              const _SectionTitle(title: 'Active cards'),
              const SizedBox(height: 8),
              const _ActiveCardTile(
                brand: 'C',
                name: 'Canva Card',
                amount: '15,000 FCFA',
                detail: '1 payment  •  Expires in 42 min',
                brandGradient: [Color(0xFF4B8EFF), Color(0xFF7947FF)],
              ),
              const SizedBox(height: 8),
              const _ActiveCardTile(
                brand: '∞',
                name: 'Meta Ads Card',
                amount: '50,000 FCFA',
                detail: '17,000 FCFA remaining\nExpires in 28 days',
                brandGradient: [Color(0xFF0A7BFF), Color(0xFF27A0FF)],
              ),
              const SizedBox(height: 14),
              const _SectionTitle(title: 'Recent activity'),
              const SizedBox(height: 4),
              const _ActivityRow(),
            ],
          ),
        ),
      ),
      bottomNavigationBar: const _BottomNav(),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Good morning,', style: TextStyle(fontSize: 12, color: LymoqColors.muted, fontWeight: FontWeight.w500)),
              SizedBox(height: 1),
              Text('Koffi 👋', style: TextStyle(fontSize: 24, height: 1, fontWeight: FontWeight.w900, letterSpacing: -.7)),
            ],
          ),
        ),
        Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(color: Colors.white, shape: BoxShape.circle, border: Border.all(color: LymoqColors.border)),
          child: const Icon(Icons.notifications_none_rounded, size: 20),
        ),
        const SizedBox(width: 8),
        Container(
          width: 38,
          height: 38,
          alignment: Alignment.center,
          decoration: const BoxDecoration(color: LymoqColors.mintStrong, shape: BoxShape.circle),
          child: const Text('K', style: TextStyle(color: LymoqColors.forest, fontWeight: FontWeight.w900)),
        ),
      ],
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel();

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 150,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(18),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF073D31), Color(0xFF07523F)],
        ),
      ),
      clipBehavior: Clip.antiAlias,
      child: Stack(
        children: [
          Positioned(right: -30, top: 14, child: Transform.rotate(angle: .35, child: Container(width: 100, height: 100, decoration: BoxDecoration(color: const Color(0x1AFFFFFF), borderRadius: BorderRadius.circular(18))))),
          Positioned(right: 20, bottom: -32, child: Transform.rotate(angle: -.25, child: Container(width: 120, height: 74, decoration: BoxDecoration(color: const Color(0x1400C890), borderRadius: BorderRadius.circular(18))))),
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 16, 18, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Pay online with\nconfidence.', style: TextStyle(color: Colors.white, fontSize: 24, height: 1.0, fontWeight: FontWeight.w900, letterSpacing: -.8)),
                const SizedBox(height: 7),
                const SizedBox(
                  width: 210,
                  child: Text('Create a virtual card in seconds and stay in control.', style: TextStyle(color: Color(0xFFD7E8E1), fontSize: 12, height: 1.25, fontWeight: FontWeight.w500)),
                ),
                const Spacer(),
                SizedBox(
                  height: 38,
                  child: FilledButton.icon(
                    onPressed: () {},
                    style: FilledButton.styleFrom(
                      backgroundColor: Colors.white,
                      foregroundColor: LymoqColors.forest,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    icon: const Icon(Icons.add_rounded, size: 18),
                    label: const Text('Create a card', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title});
  final String title;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: const TextStyle(fontSize: 17, fontWeight: FontWeight.w900, letterSpacing: -.3)),
        TextButton(
          onPressed: () {},
          style: TextButton.styleFrom(padding: EdgeInsets.zero, minimumSize: Size.zero, tapTargetSize: MaterialTapTargetSize.shrinkWrap),
          child: const Text('See all', style: TextStyle(color: LymoqColors.accent, fontSize: 11, fontWeight: FontWeight.w800)),
        ),
      ],
    );
  }
}

class _ActiveCardTile extends StatelessWidget {
  const _ActiveCardTile({
    required this.brand,
    required this.name,
    required this.amount,
    required this.detail,
    required this.brandGradient,
  });

  final String brand;
  final String name;
  final String amount;
  final String detail;
  final List<Color> brandGradient;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(11),
      decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(13), border: Border.all(color: LymoqColors.border)),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 38,
            height: 38,
            alignment: Alignment.center,
            decoration: BoxDecoration(gradient: LinearGradient(colors: brandGradient), borderRadius: BorderRadius.circular(11)),
            child: Text(brand, style: const TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.w900)),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                const SizedBox(height: 2),
                Text(amount, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
                const SizedBox(height: 2),
                Text(detail, style: const TextStyle(fontSize: 10.5, height: 1.25, color: LymoqColors.muted, fontWeight: FontWeight.w500)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(color: LymoqColors.mint, borderRadius: BorderRadius.circular(30)),
            child: const Text('ACTIVE', style: TextStyle(fontSize: 9, color: LymoqColors.success, fontWeight: FontWeight.w900)),
          ),
        ],
      ),
    );
  }
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Container(
            width: 38,
            height: 38,
            alignment: Alignment.center,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFF4B8EFF), Color(0xFF7947FF)]),
              borderRadius: BorderRadius.circular(11),
            ),
            child: const Text('C', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
          ),
          const SizedBox(width: 10),
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Canva', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                SizedBox(height: 2),
                Text('Today, 10:42', style: TextStyle(fontSize: 10.5, color: LymoqColors.muted)),
              ],
            ),
          ),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text('\$9.99', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
              SizedBox(height: 2),
              Text('Approved', style: TextStyle(fontSize: 10.5, color: LymoqColors.success, fontWeight: FontWeight.w800)),
            ],
          ),
        ],
      ),
    );
  }
}

class _BottomNav extends StatelessWidget {
  const _BottomNav();

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        height: 62,
        decoration: const BoxDecoration(color: Colors.white, border: Border(top: BorderSide(color: LymoqColors.border))),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _NavItem(icon: Icons.home_rounded, label: 'Home', selected: true),
            _NavItem(icon: Icons.credit_card_outlined, label: 'Cards'),
            _NavItem(icon: Icons.show_chart_rounded, label: 'Activity'),
            _NavItem(icon: Icons.person_outline_rounded, label: 'Profile'),
          ],
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  const _NavItem({required this.icon, required this.label, this.selected = false});
  final IconData icon;
  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final color = selected ? LymoqColors.accent : LymoqColors.muted;
    return SizedBox(
      width: 64,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 21, color: color),
          const SizedBox(height: 2),
          Text(label, style: TextStyle(fontSize: 9.5, color: color, fontWeight: selected ? FontWeight.w800 : FontWeight.w600)),
        ],
      ),
    );
  }
}

class _VirtualCard extends StatelessWidget {
  const _VirtualCard({required this.width, required this.height, required this.showMerchant});
  final double width;
  final double height;
  final bool showMerchant;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: width,
      height: height,
      clipBehavior: Clip.antiAlias,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [Color(0xFF073D31), Color(0xFF075842), Color(0xFF08705A)],
        ),
        boxShadow: const [BoxShadow(color: Color(0x30073D31), blurRadius: 22, offset: Offset(0, 12))],
      ),
      child: Stack(
        children: [
          Positioned(right: -30, top: 18, child: Transform.rotate(angle: .45, child: Container(width: 120, height: 70, decoration: BoxDecoration(color: const Color(0x12FFFFFF), borderRadius: BorderRadius.circular(16))))),
          Positioned(left: 60, bottom: -24, child: Transform.rotate(angle: -.3, child: Container(width: 150, height: 80, decoration: BoxDecoration(color: const Color(0x1300D49A), borderRadius: BorderRadius.circular(18))))),
          Padding(
            padding: const EdgeInsets.all(19),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('LYMOQ', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900)),
                    Text('VISA', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900)),
                  ],
                ),
                if (showMerchant) ...[
                  const SizedBox(height: 18),
                  const Text('CANVA CARD', style: TextStyle(color: Color(0xFFCEE2DA), fontSize: 9, fontWeight: FontWeight.w700, letterSpacing: .8)),
                ],
                const Spacer(),
                const Text('••••••  4821', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w800, letterSpacing: 1.6)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
