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
        scaffoldBackgroundColor: C.bg,
        colorScheme: ColorScheme.fromSeed(seedColor: C.forest),
      ),
      home: const OnboardingScreen(),
    );
  }
}

class C {
  static const forest = Color(0xFF073D31);
  static const forest2 = Color(0xFF005C47);
  static const accent = Color(0xFF008566);
  static const mint = Color(0xFFE8F6EF);
  static const mintStrong = Color(0xFFCDEEDF);
  static const bg = Color(0xFFF9FBF8);
  static const text = Color(0xFF111815);
  static const muted = Color(0xFF6F7C76);
  static const border = Color(0xFFE3EAE6);
  static const success = Color(0xFF18936C);
}

class R {
  const R(this.w);
  final double w;
  bool get compact => w < 360;
  bool get large => w >= 420;
  double get pad => compact ? 16 : (large ? 24 : 20);
  double get h1 => compact ? 20 : 22;
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: LayoutBuilder(
          builder: (context, c) {
            final r = R(c.maxWidth);
            final cardW = (c.maxWidth * .70).clamp(230.0, 310.0);
            final cardH = cardW * .62;
            return SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(r.pad, 14, r.pad, 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const _OnboardingHeader(),
                  SizedBox(height: r.compact ? 14 : 18),
                  Text(
                    'Your money.\nYour rules.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: r.compact ? 27 : 30,
                      height: .96,
                      fontWeight: FontWeight.w900,
                      letterSpacing: -1.2,
                      color: C.text,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Create secure virtual cards\nfor your online payments.',
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      color: C.muted,
                      fontSize: r.compact ? 13 : 14,
                      height: 1.25,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  SizedBox(height: r.compact ? 12 : 18),
                  SizedBox(
                    height: cardH + 58,
                    child: Stack(
                      alignment: Alignment.center,
                      children: [
                        Transform.translate(
                          offset: const Offset(-28, 12),
                          child: Transform.rotate(
                            angle: -.17,
                            child: _CardLayer(
                              width: cardW * .86,
                              height: cardH * .86,
                              color: const Color(0xFFBFE8D6),
                            ),
                          ),
                        ),
                        Transform.translate(
                          offset: const Offset(26, -2),
                          child: Transform.rotate(
                            angle: .08,
                            child: _CardLayer(
                              width: cardW * .88,
                              height: cardH * .88,
                              color: const Color(0xFFDDF3E9),
                            ),
                          ),
                        ),
                        Transform.rotate(
                          angle: -.12,
                          child: _VirtualCard(width: cardW, height: cardH),
                        ),
                      ],
                    ),
                  ),
                  const _Benefit(Icons.lock_outline_rounded, 'Spend online safely'),
                  const _Benefit(Icons.tune_rounded, 'Stay in control'),
                  const _Benefit(Icons.speed_rounded, 'Set your own limits'),
                  const _Benefit(Icons.public_rounded, 'Built for Africa'),
                  const SizedBox(height: 14),
                  _PrimaryButton(
                    label: 'Get started',
                    onPressed: () => Navigator.of(context).pushReplacement(
                      MaterialPageRoute<void>(builder: (_) => const HomeScreen()),
                    ),
                  ),
                  const SizedBox(height: 6),
                  TextButton(
                    onPressed: () => Navigator.of(context).pushReplacement(
                      MaterialPageRoute<void>(builder: (_) => const HomeScreen()),
                    ),
                    child: const Text(
                      'I already have an account',
                      style: TextStyle(color: C.forest, fontWeight: FontWeight.w700),
                    ),
                  ),
                ],
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
  Widget build(BuildContext context) => Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          const Text(
            'LYMOQ',
            style: TextStyle(
              color: C.forest,
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
              boxShadow: const [
                BoxShadow(
                  color: Color(0x10000000),
                  blurRadius: 10,
                  offset: Offset(0, 4),
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
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

class _Benefit extends StatelessWidget {
  const _Benefit(this.icon, this.text);
  final IconData icon;
  final String text;

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 5),
        child: Row(
          children: [
            Container(
              width: 30,
              height: 30,
              decoration: const BoxDecoration(color: C.forest2, shape: BoxShape.circle),
              child: Icon(icon, size: 16, color: Colors.white),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      );
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: C.bg,
      body: SafeArea(
        bottom: false,
        child: LayoutBuilder(
          builder: (context, c) {
            final r = R(c.maxWidth);
            return SingleChildScrollView(
              padding: EdgeInsets.fromLTRB(r.pad, 14, r.pad, 22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const _HomeHeader(),
                  const SizedBox(height: 14),
                  _HeroPanel(
                    onCreateCard: () => Navigator.of(context).push(
                      MaterialPageRoute<void>(builder: (_) => const CreateCardWhereScreen()),
                    ),
                  ),
                  const SizedBox(height: 14),
                  _SectionTitle('Active cards', compact: r.compact),
                  const SizedBox(height: 8),
                  const _ActiveCardTile(
                    'C',
                    'Canva Card',
                    '15,000 FCFA',
                    '1 payment  •  Expires in 42 min',
                    [Color(0xFF4B8EFF), Color(0xFF7947FF)],
                  ),
                  const SizedBox(height: 8),
                  const _ActiveCardTile(
                    '∞',
                    'Meta Ads Card',
                    '50,000 FCFA',
                    '17,000 FCFA remaining\nExpires in 28 days',
                    [Color(0xFF0A7BFF), Color(0xFF27A0FF)],
                  ),
                  const SizedBox(height: 14),
                  _SectionTitle('Recent activity', compact: r.compact),
                  const SizedBox(height: 4),
                  const _ActivityRow(),
                ],
              ),
            );
          },
        ),
      ),
      bottomNavigationBar: const _BottomNav(),
    );
  }
}

class _HomeHeader extends StatelessWidget {
  const _HomeHeader();

  @override
  Widget build(BuildContext context) => Row(
        children: [
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Good morning,',
                  style: TextStyle(
                    fontSize: 12,
                    color: C.muted,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                SizedBox(height: 1),
                Text(
                  'Koffi 👋',
                  style: TextStyle(
                    fontSize: 24,
                    height: 1,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -.7,
                  ),
                ),
              ],
            ),
          ),
          const _CircleIcon(icon: Icons.notifications_none_rounded),
          const SizedBox(width: 8),
          Container(
            width: 38,
            height: 38,
            alignment: Alignment.center,
            decoration: const BoxDecoration(color: C.mintStrong, shape: BoxShape.circle),
            child: const Text(
              'K',
              style: TextStyle(color: C.forest, fontWeight: FontWeight.w900),
            ),
          ),
        ],
      );
}

class _HeroPanel extends StatelessWidget {
  const _HeroPanel({required this.onCreateCard});
  final VoidCallback onCreateCard;

  @override
  Widget build(BuildContext context) => LayoutBuilder(
        builder: (context, c) {
          final r = R(c.maxWidth);
          return Container(
            width: double.infinity,
            constraints: const BoxConstraints(minHeight: 158),
            clipBehavior: Clip.antiAlias,
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(18),
              gradient: const LinearGradient(
                colors: [Color(0xFF073D31), Color(0xFF07523F)],
              ),
            ),
            child: Stack(
              children: [
                Positioned(
                  right: -30,
                  top: 14,
                  child: Transform.rotate(
                    angle: .35,
                    child: Container(
                      width: 100,
                      height: 100,
                      decoration: BoxDecoration(
                        color: const Color(0x1AFFFFFF),
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),
                ),
                Positioned(
                  right: 20,
                  bottom: -32,
                  child: Transform.rotate(
                    angle: -.25,
                    child: Container(
                      width: 120,
                      height: 74,
                      decoration: BoxDecoration(
                        color: const Color(0x1400C890),
                        borderRadius: BorderRadius.circular(18),
                      ),
                    ),
                  ),
                ),
                Padding(
                  padding: EdgeInsets.fromLTRB(
                    r.compact ? 16 : 18,
                    16,
                    r.compact ? 16 : 18,
                    16,
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Pay online with\nconfidence.',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: r.compact ? 21 : 23,
                          height: 1.02,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -.8,
                        ),
                      ),
                      const SizedBox(height: 7),
                      ConstrainedBox(
                        constraints: BoxConstraints(maxWidth: r.compact ? 185 : 220),
                        child: Text(
                          'Create a virtual card in seconds and stay in control.',
                          style: TextStyle(
                            color: const Color(0xFFD7E8E1),
                            fontSize: r.compact ? 11 : 12,
                            height: 1.22,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                      const SizedBox(height: 12),
                      FilledButton.icon(
                        onPressed: onCreateCard,
                        style: FilledButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: C.forest,
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                          minimumSize: const Size(0, 40),
                          tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(10),
                          ),
                        ),
                        icon: const Icon(Icons.add_rounded, size: 18),
                        label: const Text(
                          'Create a card',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      );
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle(this.title, {required this.compact});
  final String title;
  final bool compact;

  @override
  Widget build(BuildContext context) => Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: compact ? 16 : 17,
              fontWeight: FontWeight.w900,
              letterSpacing: -.3,
            ),
          ),
          TextButton(
            onPressed: () {},
            style: TextButton.styleFrom(
              padding: EdgeInsets.zero,
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            child: const Text(
              'See all',
              style: TextStyle(
                color: C.accent,
                fontSize: 11,
                fontWeight: FontWeight.w800,
              ),
            ),
          ),
        ],
      );
}

class _ActiveCardTile extends StatelessWidget {
  const _ActiveCardTile(this.brand, this.name, this.amount, this.detail, this.gradient);
  final String brand;
  final String name;
  final String amount;
  final String detail;
  final List<Color> gradient;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(11),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(13),
          border: Border.all(color: C.border),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 38,
              height: 38,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: LinearGradient(colors: gradient),
                borderRadius: BorderRadius.circular(11),
              ),
              child: Text(
                brand,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 21,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w900),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    amount,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    detail,
                    style: const TextStyle(
                      fontSize: 10.5,
                      height: 1.25,
                      color: C.muted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(width: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: C.mint,
                borderRadius: BorderRadius.circular(30),
              ),
              child: const Text(
                'ACTIVE',
                style: TextStyle(
                  fontSize: 9,
                  color: C.success,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ],
        ),
      );
}

class _ActivityRow extends StatelessWidget {
  const _ActivityRow();

  @override
  Widget build(BuildContext context) => Padding(
        padding: const EdgeInsets.symmetric(vertical: 10),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              alignment: Alignment.center,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF4B8EFF), Color(0xFF7947FF)],
                ),
                borderRadius: BorderRadius.circular(11),
              ),
              child: const Text(
                'C',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Canva', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                  SizedBox(height: 2),
                  Text('Today, 10:42', style: TextStyle(fontSize: 10.5, color: C.muted)),
                ],
              ),
            ),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Text('\$9.99', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900)),
                SizedBox(height: 2),
                Text(
                  'Approved',
                  style: TextStyle(
                    fontSize: 10.5,
                    color: C.success,
                    fontWeight: FontWeight.w800,
                  ),
                ),
              ],
            ),
          ],
        ),
      );
}

class _BottomNav extends StatelessWidget {
  const _BottomNav();

  @override
  Widget build(BuildContext context) => SafeArea(
        top: false,
        child: Container(
          height: 62,
          decoration: const BoxDecoration(
            color: Colors.white,
            border: Border(top: BorderSide(color: C.border)),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(Icons.home_rounded, 'Home', true),
              _NavItem(Icons.credit_card_outlined, 'Cards', false),
              _NavItem(Icons.show_chart_rounded, 'Activity', false),
              _NavItem(Icons.person_outline_rounded, 'Profile', false),
            ],
          ),
        ),
      );
}

class _NavItem extends StatelessWidget {
  const _NavItem(this.icon, this.label, this.selected);
  final IconData icon;
  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final color = selected ? C.accent : C.muted;
    return SizedBox(
      width: 64,
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 21, color: color),
          const SizedBox(height: 2),
          Text(
            label,
            style: TextStyle(
              fontSize: 9.5,
              color: color,
              fontWeight: selected ? FontWeight.w800 : FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}

class CreateCardWhereScreen extends StatefulWidget {
  const CreateCardWhereScreen({super.key});

  @override
  State<CreateCardWhereScreen> createState() => _CreateCardWhereScreenState();
}

class _CreateCardWhereScreenState extends State<CreateCardWhereScreen> {
  bool specificMerchant = true;

  @override
  Widget build(BuildContext context) => _CreateScaffold(
        step: 1,
        childBuilder: (r) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Step 1 of 4',
              style: TextStyle(fontSize: 12, color: C.muted, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Text(
              'WHERE will you use this card?',
              style: TextStyle(
                fontSize: r.h1,
                height: 1.15,
                fontWeight: FontWeight.w900,
                letterSpacing: -.45,
                color: C.text,
              ),
            ),
            const SizedBox(height: 18),
            _ChoiceCard(
              icon: Icons.language_rounded,
              title: 'Anywhere',
              subtitle: 'Use this card on any website or merchant.',
              selected: !specificMerchant,
              onTap: () => setState(() => specificMerchant = false),
            ),
            const SizedBox(height: 10),
            _ChoiceCard(
              icon: Icons.storefront_outlined,
              title: 'Specific merchant',
              subtitle: 'Limit this card to a specific merchant for more security.',
              note: '(where supported)',
              selected: specificMerchant,
              onTap: () => setState(() => specificMerchant = true),
            ),
            const SizedBox(height: 16),
            const _InfoBox(
              'Merchant restrictions are available where supported by the card network and issuing partner.',
            ),
          ],
        ),
        onContinue: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const CreateCardAmountScreen()),
        ),
      );
}

class CreateCardAmountScreen extends StatefulWidget {
  const CreateCardAmountScreen({super.key});

  @override
  State<CreateCardAmountScreen> createState() => _CreateCardAmountScreenState();
}

class _CreateCardAmountScreenState extends State<CreateCardAmountScreen> {
  int amount = 15000;
  final options = const [5000, 10000, 25000, 50000, 100000];

  String dollars(int value) => '\$${(value / 565).toStringAsFixed(2)}';

  Future<void> _customAmount() async {
    final controller = TextEditingController(text: amount.toString());
    final result = await showDialog<int>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Custom amount'),
        content: TextField(
          controller: controller,
          autofocus: true,
          keyboardType: TextInputType.number,
          decoration: const InputDecoration(labelText: 'Amount in FCFA'),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              final value = int.tryParse(controller.text.replaceAll(' ', ''));
              if (value != null && value > 0) Navigator.pop(context, value);
            },
            child: const Text('Use amount'),
          ),
        ],
      ),
    );
    controller.dispose();
    if (result != null && mounted) setState(() => amount = result);
  }

  @override
  Widget build(BuildContext context) => _CreateScaffold(
        step: 2,
        childBuilder: (r) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Step 2 of 4',
              style: TextStyle(fontSize: 12, color: C.muted, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Text(
              'HOW MUCH can this card spend?',
              style: TextStyle(
                fontSize: r.h1,
                height: 1.15,
                fontWeight: FontWeight.w900,
                letterSpacing: -.45,
                color: C.text,
              ),
            ),
            const SizedBox(height: 18),
            Container(
              width: double.infinity,
              padding: EdgeInsets.all(r.compact ? 16 : 18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: C.border),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    children: [
                      Expanded(
                        child: FittedBox(
                          fit: BoxFit.scaleDown,
                          alignment: Alignment.centerLeft,
                          child: Text(
                            _format(amount),
                            style: TextStyle(
                              fontSize: r.compact ? 30 : 34,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -.8,
                              color: C.text,
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
                        decoration: BoxDecoration(
                          color: C.mint,
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFD4EDE2)),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Text(
                              'FCFA',
                              style: TextStyle(
                                fontSize: 11,
                                color: C.forest,
                                fontWeight: FontWeight.w900,
                              ),
                            ),
                            SizedBox(width: 5),
                            Icon(Icons.keyboard_arrow_down_rounded, size: 17, color: C.forest),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '≈ ${dollars(amount)} (indicative exchange rate)',
                    style: const TextStyle(
                      fontSize: 11,
                      color: C.muted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            LayoutBuilder(
              builder: (context, c) {
                final itemWidth = (c.maxWidth - 20) / 3;
                return Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    ...options.map(
                      (v) => _AmountChip(
                        width: itemWidth,
                        label: _format(v),
                        sublabel: '≈ ${dollars(v)}',
                        selected: amount == v,
                        onTap: () => setState(() => amount = v),
                      ),
                    ),
                    _AmountChip(
                      width: itemWidth,
                      label: 'Custom',
                      sublabel: amount != 15000 && !options.contains(amount) ? _format(amount) : '',
                      selected: !options.contains(amount) && amount != 15000,
                      onTap: _customAmount,
                    ),
                  ],
                );
              },
            ),
            const SizedBox(height: 16),
            const _InfoBox(
              'You can only spend up to this amount. You can always create another card later.',
            ),
          ],
        ),
        onContinue: () => Navigator.of(context).push(
          MaterialPageRoute<void>(builder: (_) => const CreateCardUsageScreen()),
        ),
      );

  String _format(int value) {
    final s = value.toString();
    final b = StringBuffer();
    for (var i = 0; i < s.length; i++) {
      if (i > 0 && (s.length - i) % 3 == 0) b.write(',');
      b.write(s[i]);
    }
    return b.toString();
  }
}

class CreateCardUsageScreen extends StatefulWidget {
  const CreateCardUsageScreen({super.key});

  @override
  State<CreateCardUsageScreen> createState() => _CreateCardUsageScreenState();
}

class _CreateCardUsageScreenState extends State<CreateCardUsageScreen> {
  int selectedUsage = 1;

  @override
  Widget build(BuildContext context) => _CreateScaffold(
        step: 3,
        childBuilder: (r) => Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Step 3 of 4',
              style: TextStyle(fontSize: 12, color: C.muted, fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 10),
            Text(
              'HOW MANY payments?',
              style: TextStyle(
                fontSize: r.h1,
                height: 1.15,
                fontWeight: FontWeight.w900,
                letterSpacing: -.45,
                color: C.text,
              ),
            ),
            const SizedBox(height: 18),
            _UsageOption(
              title: '1 payment',
              subtitle: 'Card will be closed after 1 payment',
              selected: selectedUsage == 1,
              onTap: () => setState(() => selectedUsage = 1),
            ),
            const SizedBox(height: 10),
            _UsageOption(
              title: '5 payments',
              subtitle: 'Card can be used up to 5 times',
              selected: selectedUsage == 5,
              onTap: () => setState(() => selectedUsage = 5),
            ),
            const SizedBox(height: 10),
            _UsageOption(
              title: 'Until expiration',
              subtitle: 'Use multiple times until the card expires',
              selected: selectedUsage == -1,
              onTap: () => setState(() => selectedUsage = -1),
            ),
          ],
        ),
        onContinue: () {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Screen 06 — Duration comes next.'),
              behavior: SnackBarBehavior.floating,
            ),
          );
        },
      );
}

class _CreateScaffold extends StatelessWidget {
  const _CreateScaffold({
    required this.step,
    required this.childBuilder,
    required this.onContinue,
  });

  final int step;
  final Widget Function(R r) childBuilder;
  final VoidCallback onContinue;

  @override
  Widget build(BuildContext context) => Scaffold(
        backgroundColor: C.bg,
        body: SafeArea(
          child: LayoutBuilder(
            builder: (context, c) {
              final r = R(c.maxWidth);
              return Column(
                children: [
                  Expanded(
                    child: SingleChildScrollView(
                      padding: EdgeInsets.fromLTRB(r.pad, 12, r.pad, 22),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          _CreateHeader(onBack: () => Navigator.of(context).pop()),
                          SizedBox(height: r.compact ? 18 : 22),
                          _StepProgress(step),
                          SizedBox(height: r.compact ? 18 : 22),
                          childBuilder(r),
                        ],
                      ),
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.fromLTRB(r.pad, 10, r.pad, 14),
                    decoration: const BoxDecoration(color: C.bg),
                    child: _PrimaryButton(label: 'Continue', onPressed: onContinue),
                  ),
                ],
              );
            },
          ),
        ),
      );
}

class _CreateHeader extends StatelessWidget {
  const _CreateHeader({required this.onBack});
  final VoidCallback onBack;

  @override
  Widget build(BuildContext context) => SizedBox(
        height: 44,
        child: Row(
          children: [
            SizedBox(
              width: 44,
              height: 44,
              child: IconButton(
                onPressed: onBack,
                padding: EdgeInsets.zero,
                icon: const Icon(Icons.arrow_back_ios_new_rounded, size: 19),
              ),
            ),
            const Expanded(
              child: Text(
                'Create a secure card',
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                  color: C.text,
                ),
              ),
            ),
            const SizedBox(width: 44),
          ],
        ),
      );
}

class _StepProgress extends StatelessWidget {
  const _StepProgress(this.active);
  final int active;

  @override
  Widget build(BuildContext context) => Row(
        children: List.generate(
          4,
          (i) => Expanded(
            child: Container(
              height: 4,
              margin: EdgeInsets.only(right: i == 3 ? 0 : 8),
              decoration: BoxDecoration(
                color: i < active ? C.accent : const Color(0xFFE1E9E5),
                borderRadius: BorderRadius.circular(99),
              ),
            ),
          ),
        ),
      );
}

class _ChoiceCard extends StatelessWidget {
  const _ChoiceCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.selected,
    required this.onTap,
    this.note,
  });

  final IconData icon;
  final String title;
  final String subtitle;
  final String? note;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            width: double.infinity,
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: selected ? C.accent : C.border,
                width: selected ? 1.6 : 1,
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 38,
                  height: 38,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: selected ? C.mint : const Color(0xFFF4F6F5),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    icon,
                    size: 21,
                    color: selected ? C.accent : C.text,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Wrap(
                        spacing: 5,
                        runSpacing: 2,
                        crossAxisAlignment: WrapCrossAlignment.center,
                        children: [
                          Text(
                            title,
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: C.text,
                            ),
                          ),
                          if (note != null)
                            Text(
                              note!,
                              style: const TextStyle(
                                fontSize: 10.5,
                                fontWeight: FontWeight.w600,
                                color: C.muted,
                              ),
                            ),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 11.5,
                          height: 1.3,
                          color: C.muted,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),
                _SelectionDot(selected: selected),
              ],
            ),
          ),
        ),
      );
}

class _UsageOption extends StatelessWidget {
  const _UsageOption({
    required this.title,
    required this.subtitle,
    required this.selected,
    required this.onTap,
  });

  final String title;
  final String subtitle;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(14),
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 160),
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 16),
            decoration: BoxDecoration(
              color: selected ? const Color(0xFFF7FCF9) : Colors.white,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(
                color: selected ? C.accent : C.border,
                width: selected ? 1.6 : 1,
              ),
              boxShadow: selected
                  ? const [
                      BoxShadow(
                        color: Color(0x10008566),
                        blurRadius: 12,
                        offset: Offset(0, 4),
                      ),
                    ]
                  : null,
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                _RadioMark(selected: selected),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w900,
                          color: C.text,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          fontSize: 11.5,
                          height: 1.3,
                          color: C.muted,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
}

class _RadioMark extends StatelessWidget {
  const _RadioMark({required this.selected});
  final bool selected;

  @override
  Widget build(BuildContext context) => Container(
        width: 22,
        height: 22,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(
            color: selected ? C.accent : const Color(0xFFBAC6C0),
            width: selected ? 2 : 1.5,
          ),
        ),
        alignment: Alignment.center,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: selected ? 10 : 0,
          height: selected ? 10 : 0,
          decoration: const BoxDecoration(
            color: C.accent,
            shape: BoxShape.circle,
          ),
        ),
      );
}

class _SelectionDot extends StatelessWidget {
  const _SelectionDot({required this.selected});
  final bool selected;

  @override
  Widget build(BuildContext context) => Container(
        width: 22,
        height: 22,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: selected ? C.accent : Colors.transparent,
          border: Border.all(
            color: selected ? C.accent : const Color(0xFFBFCAC5),
            width: 1.5,
          ),
        ),
        child: selected
            ? const Icon(Icons.check_rounded, size: 14, color: Colors.white)
            : null,
      );
}

class _AmountChip extends StatelessWidget {
  const _AmountChip({
    required this.width,
    required this.label,
    required this.sublabel,
    required this.selected,
    required this.onTap,
  });

  final double width;
  final String label;
  final String sublabel;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 150),
          width: width,
          height: 68,
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 10),
          decoration: BoxDecoration(
            color: selected ? C.mint : Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(
              color: selected ? C.accent : C.border,
              width: selected ? 1.5 : 1,
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: selected ? C.forest : C.text,
                    fontWeight: FontWeight.w900,
                  ),
                ),
              ),
              if (sublabel.isNotEmpty) ...[
                const SizedBox(height: 3),
                FittedBox(
                  fit: BoxFit.scaleDown,
                  alignment: Alignment.centerLeft,
                  child: Text(
                    sublabel,
                    style: const TextStyle(
                      fontSize: 9.5,
                      color: C.muted,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      );
}

class _InfoBox extends StatelessWidget {
  const _InfoBox(this.text);
  final String text;

  @override
  Widget build(BuildContext context) => Container(
        width: double.infinity,
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: const Color(0xFFF0F8F4),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Icon(Icons.info_outline_rounded, size: 19, color: C.accent),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                text,
                style: const TextStyle(
                  color: C.muted,
                  fontSize: 11.5,
                  height: 1.35,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      );
}

class _PrimaryButton extends StatelessWidget {
  const _PrimaryButton({required this.label, required this.onPressed});
  final String label;
  final VoidCallback onPressed;

  @override
  Widget build(BuildContext context) => SizedBox(
        width: double.infinity,
        height: 52,
        child: FilledButton(
          onPressed: onPressed,
          style: FilledButton.styleFrom(
            backgroundColor: C.forest2,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(13)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(label, style: const TextStyle(fontWeight: FontWeight.w800)),
              const SizedBox(width: 12),
              const Icon(Icons.arrow_forward_rounded, size: 18),
            ],
          ),
        ),
      );
}

class _CircleIcon extends StatelessWidget {
  const _CircleIcon({required this.icon});
  final IconData icon;

  @override
  Widget build(BuildContext context) => Container(
        width: 38,
        height: 38,
        decoration: BoxDecoration(
          color: Colors.white,
          shape: BoxShape.circle,
          border: Border.all(color: C.border),
        ),
        child: Icon(icon, size: 20),
      );
}

class _CardLayer extends StatelessWidget {
  const _CardLayer({required this.width, required this.height, required this.color});
  final double width;
  final double height;
  final Color color;

  @override
  Widget build(BuildContext context) => Container(
        width: width,
        height: height,
        decoration: BoxDecoration(
          color: color,
          borderRadius: BorderRadius.circular(20),
        ),
      );
}

class _VirtualCard extends StatelessWidget {
  const _VirtualCard({required this.width, required this.height});
  final double width;
  final double height;

  @override
  Widget build(BuildContext context) => Container(
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
          boxShadow: const [
            BoxShadow(
              color: Color(0x30073D31),
              blurRadius: 22,
              offset: Offset(0, 12),
            ),
          ],
        ),
        child: Stack(
          children: [
            Positioned(
              right: -30,
              top: 18,
              child: Transform.rotate(
                angle: .45,
                child: Container(
                  width: 120,
                  height: 70,
                  decoration: BoxDecoration(
                    color: const Color(0x12FFFFFF),
                    borderRadius: BorderRadius.circular(16),
                  ),
                ),
              ),
            ),
            Positioned(
              left: 60,
              bottom: -24,
              child: Transform.rotate(
                angle: -.3,
                child: Container(
                  width: 150,
                  height: 80,
                  decoration: BoxDecoration(
                    color: const Color(0x1300D49A),
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.all(19),
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
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      Text(
                        'VISA',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 16,
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                  Spacer(),
                  Text(
                    '••••••  4821',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.6,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      );
}
