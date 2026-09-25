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
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF073D31)),
      ),
      home: const OnboardingScreen(),
    );
  }
}

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  static const forest = Color(0xFF073D31);
  static const forest2 = Color(0xFF005C47);
  static const mint = Color(0xFFDFF3E9);
  static const mintStrong = Color(0xFFBFE7D3);
  static const muted = Color(0xFF67766F);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 16, 24, 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('LYMOQ', style: TextStyle(color: forest, fontSize: 22, fontWeight: FontWeight.w900, letterSpacing: 1.3)),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 8),
                    decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12), boxShadow: const [BoxShadow(color: Color(0x12000000), blurRadius: 12, offset: Offset(0, 4))]),
                    child: const Row(children: [Text('EN', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)), SizedBox(width: 4), Icon(Icons.keyboard_arrow_down_rounded, size: 16)]),
                  )
                ],
              ),
              const SizedBox(height: 22),
              const Text('Your money.\nYour rules.', textAlign: TextAlign.center, style: TextStyle(fontSize: 30, height: .98, fontWeight: FontWeight.w900, letterSpacing: -1.1)),
              const SizedBox(height: 10),
              const Text('Create secure virtual cards\nfor your online payments.', textAlign: TextAlign.center, style: TextStyle(fontSize: 14, height: 1.35, color: muted, fontWeight: FontWeight.w500)),
              const SizedBox(height: 20),
              Expanded(
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    Container(
                      width: 250,
                      height: 180,
                      decoration: BoxDecoration(color: mint.withOpacity(.7), borderRadius: BorderRadius.circular(48)),
                    ),
                    Transform.rotate(
                      angle: -0.13,
                      child: Container(
                        width: 260,
                        height: 160,
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(22),
                          gradient: const LinearGradient(begin: Alignment.topLeft, end: Alignment.bottomRight, colors: [forest, Color(0xFF0A5947), Color(0xFF0D7058)]),
                          boxShadow: const [BoxShadow(color: Color(0x33073D31), blurRadius: 24, offset: Offset(0, 14))],
                        ),
                        child: const Padding(
                          padding: EdgeInsets.all(20),
                          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [Text('LYMOQ', style: TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)), Text('VISA', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w900))]),
                            Spacer(),
                            Text('••••  4821', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.w700, letterSpacing: 2)),
                          ]),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 6),
              ...const [
                _Benefit(icon: Icons.lock_outline_rounded, text: 'Spend online safely'),
                _Benefit(icon: Icons.tune_rounded, text: 'Stay in control'),
                _Benefit(icon: Icons.speed_rounded, text: 'Set your own limits'),
                _Benefit(icon: Icons.public_rounded, text: 'Built for Africa'),
              ],
              const SizedBox(height: 16),
              SizedBox(
                height: 56,
                child: FilledButton(
                  onPressed: () {},
                  style: FilledButton.styleFrom(backgroundColor: forest2, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14))),
                  child: const Row(mainAxisAlignment: MainAxisAlignment.center, children: [Text('Get started', style: TextStyle(fontWeight: FontWeight.w800)), SizedBox(width: 12), Icon(Icons.arrow_forward_rounded, size: 18)]),
                ),
              ),
              const SizedBox(height: 10),
              TextButton(onPressed: () {}, child: const Text('I already have an account', style: TextStyle(color: forest, fontWeight: FontWeight.w700))),
            ],
          ),
        ),
      ),
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
      child: Row(children: [
        Container(width: 30, height: 30, decoration: const BoxDecoration(color: OnboardingScreen.mintStrong, shape: BoxShape.circle), child: const Icon(Icons.check_rounded, size: 16, color: OnboardingScreen.forest)),
        const SizedBox(width: 12),
        Text(text, style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w700)),
      ]),
    );
  }
}
