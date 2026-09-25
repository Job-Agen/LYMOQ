import 'package:flutter/material.dart';

void main() {
  runApp(const LymoqApp());
}

class LymoqApp extends StatelessWidget {
  const LymoqApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'LYMOQ',
      theme: ThemeData(
        useMaterial3: true,
        scaffoldBackgroundColor: const Color(0xFFF8FAF7),
        fontFamily: 'Roboto',
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF073D31),
          brightness: Brightness.light,
        ),
      ),
      home: const OnboardingScreen(),
    );
  }
}

class LymoqColors {
  static const forest = Color(0xFF073D31);
  static const forest2 = Color(0xFF005C47);
  static const accent = Color(0xFF008566);
  static const mint = Color(0xFFDFF3E9);
  static const mintStrong = Color(0xFFBFE7D3);
  static const background = Color(0xFFF8FAF7);
  static const muted = Color(0xFF67766F);
  static const border = Color(0xFFE4EAE6);
  static const white = Colors.white;
  static const text = Color(0xFF101815);
  static const success = Color(0xFF167A5C);
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final cardWidth = (width * .72).clamp(250.0, 330.0).toDouble();
    final cardHeight = cardWidth * .61;

    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, constraints) {
            return SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              padding: const EdgeInsets.fromLTRB(24, 16, 24, 22),
              child: ConstrainedBox(
                constraints: BoxConstraints(
                  minHeight: (constraints.maxHeight - 38).clamp(0.0, double.infinity),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const _OnboardingHeader(),
                    const SizedBox(height: 24),
                    const Text(
                      'Your money.\nYour rules.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 30,
                        height: .98,
                        fontWeight: FontWeight.w900,
                        letterSpacing: -1.1,
                        color: LymoqColors.text,
                      ),
                    ),
                    const SizedBox(height: 12),
                    const Text(
                      'Create secure virtual cards\nfor your online payments.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 14,
                        height: 1.35,
                        color: LymoqColors.muted,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    const SizedBox(height: 30),
                    SizedBox(
                      height: cardHeight + 54,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          Container(
                            width: cardWidth * .92,
                            height: cardHeight + 18,
                            decoration: BoxDecoration(
                              color: const Color(0xB3DFF3E9),
                              borderRadius: BorderRadius.circular(48),
                            ),
                          ),
                          Transform.rotate(
                            angle: -0.13,
                            child: Container(
                              width: cardWidth,
                              height: cardHeight,
                              decoration: BoxDecoration(
                                borderRadius: BorderRadius.circular(22),
                                gradient: const LinearGradient(
                                  begin: Alignment.topLeft,
                                  end: Alignment.bottomRight,
                                  colors: [
                                    LymoqColors.forest,
                                    Color(0xFF0A5947),
                                    Color(0xFF0D7058),
                                  ],
                                ),
                                boxShadow: const [
                                  BoxShadow(
                                    color: Color(0x33073D31),
                                    blurRadius: 24,
                                    offset: Offset(0, 14),
                                  ),
                                ],
                              ),
                              child: const Padding(
                                padding: EdgeInsets.all(20),
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                      children: [
                                        Text(
                                          'LYMOQ',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 20,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                        Text(
                                          'VISA',
                                          style: TextStyle(
                                            color: Colors.white,
                                            fontSize: 18,
                                            fontWeight: FontWeight.w900,
                                          ),
                                        ),
                                      ],
                                    ),
                                    Spacer(),
                                    Text(
                                      '••••  4821',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 18,
                                        fontWeight: FontWeight.w700,
                                        letterSpacing: 2,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 24),
                    const _Benefit(text: 'Spend online safely'),
                    const _Benefit(text: 'Stay in control'),
                    const _Benefit(text: 'Set your own limits'),
                    const _Benefit(text: 'Built for Africa'),
                    const SizedBox(height: 22),
                    SizedBox(
                      height: 56,
                      child: FilledButton(
                        onPressed: () {
                          Navigator.of(context).pushReplacement(
                            MaterialPageRoute<void>(
                              builder: (_) => const HomeScreen(),
                            ),
                          );
                        },
                        style: FilledButton.styleFrom(
                          backgroundColor: LymoqColors.forest2,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                        child: const Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              'Get started',
                              style: TextStyle(fontWeight: FontWeight.w800),
                            ),
                            SizedBox(width: 12),
                            Icon(Icons.arrow_forward_rounded, size: 18),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(height: 10),
                    TextButton(
                      onPressed: () {
                        Navigator.of(context).pushReplacement(
                          MaterialPageRoute<void>(
                            builder: (_) => const HomeScreen(),
                          ),
                        );
                      },
                      child: const Text(
                        'I already have an account',
                        style: TextStyle(
                          color: LymoqColors.forest,
                          fontWeight: FontWeight.w700,
                        ),
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
            letterSpacing: 1.3,
          ),
        ),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            boxShadow: const [
              BoxShadow(
                color: Color(0x12000000),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          child: const Row(
            children: [
              Text(
                'EN',
                style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800),
              ),
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
  const _Benefit({required this.text});
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
            decoration: const BoxDecoration(
              color: LymoqColors.mintStrong,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.check_rounded,
              size: 16,
              color: LymoqColors.forest,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            text,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
          ),
        ],
      ),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  void _showNextStep() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Create Card flow will be implemented in screen 03.'),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: LymoqColors.background,
      body: SafeArea(
        bottom: false,
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.fromLTRB(20, 18, 20, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const _HomeHeader(),
              const SizedBox(height: 26),
              _HeroPanel(onCreateCard: _showNextStep),
              const SizedBox(height: 28),
              const _SectionTitle(title: 'Active cards', action: 'See all'),
              const SizedBox(height: 14),
              const _ActiveCardTile(),
              const SizedBox(height: 28),
              const _SectionTitle(title: 'Recent activity', action: 'See all'),
              const SizedBox(height: 8),
              const _ActivityRow(
                icon: Icons.design_services_outlined,
                merchant: 'Canva',
                subtitle: 'Today · 10:42',
                amount: '5,650 FCFA',
                status: 'Approved',
                statusColor: LymoqColors.success,
              ),
              const Divider(height: 1, color: LymoqColors.border),
              const _ActivityRow(
                icon: Icons.campaign_outlined,
                merchant: 'Meta Ads',
                subtitle: 'Yesterday · 18:11',
                amount: '12,000 FCFA',
                status: 'Approved',
                statusColor: LymoqColors.success,
              ),
              const Divider(height: 1, color: LymoqColors.border),
              const _ActivityRow(
                icon: Icons.language_rounded,
                merchant: 'Google',
                subtitle: 'Yesterday · 14:06',
                amount: '16,500 FCFA',
                status: 'Blocked',
                statusColor: Color(0xFFC9504D),
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: SafeArea(
        top: false,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: LymoqColors.border)),
          ),
          child: NavigationBar(
            height: 72,
            backgroundColor: Colors.white,
            indicatorColor: LymoqColors.mint,
            selectedIndex: _selectedIndex,
            onDestinationSelected: (index) {
              setState(() => _selectedIndex = index);
              if (index != 0) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                    content: Text(
                      '${['Home', 'Cards', 'Activity', 'Profile'][index]} screen comes next.',
                    ),
                    behavior: SnackBarBehavior.floating,
                  ),
                );
              }
            },
            destinations: const [
              NavigationDestination(
                icon: Icon(Icons.home_outlined),
                selectedIcon: Icon(Icons.home_rounded),
                label: 'Home',
              ),
              NavigationDestination(
                icon: Icon(Icons.credit_card_outlined),
                selectedIcon: Icon(Icons.credit_card_rounded),
                label: 'Cards',
              ),
              NavigationDestination(
                icon: Icon(Icons.receipt_long_outlined),
                selectedIcon: Icon(Icons.receipt_long_rounded),
                label: 'Activity',
              ),
              NavigationDestination(
                icon: Icon(Icons.person_outline_rounded),
                selectedIcon: Icon(Icons.person_rounded),
                label: 'Profile',
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader();

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: const [
              Text(
                'Good morning,',
                style: TextStyle(
                  fontSize: 14,
                  color: LymoqColors.muted,
                  fontWeight: FontWeight.w500,
                ),
              ),
              SizedBox(height: 2),
              Text(
                'Koffi 👋',
                style: TextStyle(
                  fontSize: 26,
                  height: 1,
                  color: LymoqColors.text,
                  fontWeight: FontWeight.w900,
                  letterSpacing: -0.7,
                ),
              ),
            ],
          ),
        ),
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: LymoqColors.border),
          ),
          child: const Icon(Icons.notifications_none_rounded, size: 22),
        ),
        const SizedBox(width: 10),
        Container(
          width: 44,
          height: 44,
          decoration: const BoxDecoration(
            color: LymoqColors.mintStrong,
            shape: BoxShape.circle,
          ),
          alignment: Alignment.center,
          child: const Text(
            'K',
            style: TextStyle(
              color: LymoqColors.forest,
              fontSize: 16,
              fontWeight: FontWeight.w900,
            ),
          ),
        ),
      ],
    );
  }
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.onCreateCard});

  final VoidCallback onCreateCard;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: [
            LymoqColors.forest,
            Color(0xFF0A5847),
            Color(0xFF0D6B56),
          ],
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x24073D31),
            blurRadius: 24,
            offset: Offset(0, 12),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0x22FFFFFF),
              borderRadius: BorderRadius.circular(30),
            ),
            child: const Text(
              'YOUR MONEY. YOUR RULES.',
              style: TextStyle(
                color: Colors.white,
                fontSize: 10,
                letterSpacing: .8,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
          const SizedBox(height: 16),
          const Text(
            'Pay online with\nconfidence.',
            style: TextStyle(
              color: Colors.white,
              fontSize: 28,
              height: 1.05,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.9,
            ),
          ),
          const SizedBox(height: 10),
          const Text(
            'Create a virtual card in seconds and stay in control.',
            style: TextStyle(
              color: Color(0xFFD7E8E1),
              fontSize: 14,
              height: 1.4,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 20),
          SizedBox(
            height: 48,
            child: FilledButton.icon(
              onPressed: onCreateCard,
              style: FilledButton.styleFrom(
                backgroundColor: Colors.white,
                foregroundColor: LymoqColors.forest,
                padding: const EdgeInsets.symmetric(horizontal: 18),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(14),
                ),
              ),
              icon: const Icon(Icons.add_rounded, size: 20),
              label: const Text(
                'Create a card',
                style: TextStyle(fontWeight: FontWeight.w800),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({required this.title, required this.action});

  final String title;
  final String action;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          title,
          style: const TextStyle(
            color: LymoqColors.text,
            fontSize: 18,
            fontWeight: FontWeight.w900,
            letterSpacing: -0.3,
          ),
        ),
        Text(
          action,
          style: const TextStyle(
            color: LymoqColors.accent,
            fontSize: 12,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _ActiveCardTile extends StatelessWidget {
  const _ActiveCardTile();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: LymoqColors.border),
        boxShadow: const [
          BoxShadow(
            color: Color(0x08000000),
            blurRadius: 18,
            offset: Offset(0, 8),
          ),
        ],
      ),
      child: Column(
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 56,
                height: 40,
                decoration: BoxDecoration(
                  color: LymoqColors.forest,
                  borderRadius: BorderRadius.circular(12),
                ),
                alignment: Alignment.center,
                child: const Text(
                  'LYMOQ',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 9,
                    letterSpacing: .5,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              const SizedBox(width: 14),
              const Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            'Canva Card',
                            style: TextStyle(
                              fontSize: 15,
                              color: LymoqColors.text,
                              fontWeight: FontWeight.w900,
                            ),
                          ),
                        ),
                        _StatusPill(text: 'ACTIVE'),
                      ],
                    ),
                    SizedBox(height: 4),
                    Text(
                      '•••• 4821',
                      style: TextStyle(
                        color: LymoqColors.muted,
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF4F8F5),
              borderRadius: BorderRadius.circular(16),
            ),
            child: const Row(
              children: [
                Expanded(
                  child: _MiniMetric(label: 'LIMIT', value: '15,000 FCFA'),
                ),
                _VerticalDivider(),
                Expanded(
                  child: _MiniMetric(label: 'PAYMENTS', value: '1'),
                ),
                _VerticalDivider(),
                Expanded(
                  child: _MiniMetric(label: 'EXPIRES', value: '42 min'),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _StatusPill extends StatelessWidget {
  const _StatusPill({required this.text});

  final String text;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
      decoration: BoxDecoration(
        color: LymoqColors.mint,
        borderRadius: BorderRadius.circular(99),
      ),
      child: Text(
        text,
        style: const TextStyle(
          color: LymoqColors.success,
          fontSize: 9,
          fontWeight: FontWeight.w900,
          letterSpacing: .5,
        ),
      ),
    );
  }
}

class _MiniMetric extends StatelessWidget {
  const _MiniMetric({required this.label, required this.value});

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          label,
          style: const TextStyle(
            color: LymoqColors.muted,
            fontSize: 8,
            fontWeight: FontWeight.w800,
            letterSpacing: .5,
          ),
        ),
        const SizedBox(height: 3),
        Text(
          value,
          textAlign: TextAlign.center,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: const TextStyle(
            color: LymoqColors.text,
            fontSize: 11,
            fontWeight: FontWeight.w800,
          ),
        ),
      ],
    );
  }
}

class _VerticalDivider extends StatelessWidget {
  const _VerticalDivider();

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 1,
      height: 30,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      color: LymoqColors.border,
    );
  }
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow({
    required this.icon,
    required this.merchant,
    required this.subtitle,
    required this.amount,
    required this.status,
    required this.statusColor,
  });

  final IconData icon;
  final String merchant;
  final String subtitle;
  final String amount;
  final String status;
  final Color statusColor;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 14),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: LymoqColors.border),
            ),
            child: Icon(icon, color: LymoqColors.forest, size: 21),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  merchant,
                  style: const TextStyle(
                    color: LymoqColors.text,
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  subtitle,
                  style: const TextStyle(
                    color: LymoqColors.muted,
                    fontSize: 11,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                amount,
                style: const TextStyle(
                  color: LymoqColors.text,
                  fontSize: 12,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 3),
              Text(
                status,
                style: TextStyle(
                  color: statusColor,
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
