import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <div className="text-center text-sm text-muted-foreground mb-4 flex items-center justify-center gap-1">
      <div>
        Made with ❤️ by{' '}
        <Link
          href="https://merit.systems"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          Merit Systems
        </Link>
      </div>
      {/* Light mode logo */}
      <Image
        src="https://terminal.merit.systems/brand/logo/light.svg"
        alt="Merit Systems"
        width={16}
        height={16}
        className="block dark:hidden"
      />
      {/* Dark mode logo */}
      <Image
        src="https://terminal.merit.systems/brand/logo/dark.svg"
        alt="Merit Systems"
        width={16}
        height={16}
        className="hidden dark:block"
      />
    </div>
  );
}
