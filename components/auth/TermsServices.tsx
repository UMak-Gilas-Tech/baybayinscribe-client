import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

/**
 * TermsServices Component
 *
 * A component that displays Terms of Service and Privacy Policy links with optional checkbox.
 *
 * Usage:
 * 1. Required mode (with checkbox):
 * ```tsx
 * const [termsChecked, setTermsChecked] = useState(false);
 *
 * <TermsServices
 *   mode="required"
 *   checked={termsChecked}
 *   onCheckedChange={setTermsChecked}
 * />
 * ```
 *
 * 2. Info mode (without checkbox):
 * ```tsx
 * <TermsServices mode="info" />
 * ```
 */
interface TermsProps {
  /** The mode of the component - 'required' shows checkbox, 'info' shows only links */
  mode: "required" | "info";
  /** The checked state of the checkbox (only used in required mode) */
  checked?: boolean;
  /** Callback when checkbox state changes (only used in required mode) */
  onCheckedChange?: (checked: boolean) => void;
}

export const TermsServices = ({
  mode = "info",
  checked = false,
  onCheckedChange = () => {},
}: TermsProps) => {
  const isRequired = mode === "required";

  return (
    <div className="flex items-start space-x-2 text-neutral-white font-light font-sans w-full max-w-md">
      {isRequired && (
        <Checkbox
          id="terms"
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-1"
        />
      )}
      <div className="grid gap-1.5 leading-none">
        <Label
          htmlFor={isRequired ? "terms" : undefined}
          className="text-sm font-light leading-none"
        >
          {isRequired ? "I agree to the" : "By continuing, you agree to our"}{" "}
          <Dialog>
            <DialogTrigger className="text-blue-900 hover:underline cursor-pointer">
              Terms of Service
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Terms of Service</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <section>
                  <h3 className="font-semibold mb-2">1. Acceptance of Terms</h3>
                  <p>
                    By accessing and using BaybayInscribe, you accept and agree
                    to be bound by the terms and provision of this agreement.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">2. Use License</h3>
                  <p>
                    Permission is granted to temporarily use BaybayInscribe for
                    personal, non-commercial transitory viewing only.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">3. User Account</h3>
                  <p>
                    You are responsible for maintaining the confidentiality of
                    your account and password. You agree to accept
                    responsibility for all activities that occur under your
                    account.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">4. Privacy Policy</h3>
                  <p>
                    Your use of BaybayInscribe is also governed by our Privacy
                    Policy. Please review our Privacy Policy, which also governs
                    the site and informs users of our data collection practices.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">5. Disclaimer</h3>
                  <p>
                    The materials on BaybayInscribe are provided on an &apos;as
                    is&apos; basis. BaybayInscribe makes no warranties,
                    expressed or implied, and hereby disclaims and negates all
                    other warranties including, without limitation, implied
                    warranties or conditions of merchantability, fitness for a
                    particular purpose, or non-infringement of intellectual
                    property or other violation of rights.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">6. Limitations</h3>
                  <p>
                    In no event shall BaybayInscribe or its suppliers be liable
                    for any damages (including, without limitation, damages for
                    loss of data or profit, or due to business interruption)
                    arising out of the use or inability to use the materials on
                    BaybayInscribe.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">7. Revisions</h3>
                  <p>
                    BaybayInscribe may revise these terms of service at any time
                    without notice. By using this website, you are agreeing to
                    be bound by the then current version of these terms of
                    service.
                  </p>
                </section>
              </div>
            </DialogContent>
          </Dialog>{" "}
          &{" "}
          <Dialog>
            <DialogTrigger className="text-blue-900 hover:underline cursor-pointer">
              Privacy Policy
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Privacy Policy</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <section>
                  <h3 className="font-semibold mb-2">
                    1. Information Collection
                  </h3>
                  <p>
                    We collect information that you provide directly to us,
                    including but not limited to your name, email address, and
                    any other information you choose to provide.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">2. Use of Information</h3>
                  <p>
                    We use the information we collect to provide, maintain, and
                    improve our services, to develop new ones, and to protect
                    BaybayInscribe and our users.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">3. Information Sharing</h3>
                  <p>
                    We do not share your personal information with third parties
                    except as described in this privacy policy.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">4. Data Security</h3>
                  <p>
                    We take reasonable measures to help protect information
                    about you from loss, theft, misuse, unauthorized access,
                    disclosure, alteration, and destruction.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">5. Your Rights</h3>
                  <p>
                    You have the right to access, correct, or delete your
                    personal information. You can also object to our processing
                    of your personal information.
                  </p>
                </section>

                <section>
                  <h3 className="font-semibold mb-2">6. Changes to Policy</h3>
                  <p>
                    We may change this privacy policy from time to time. We will
                    post any privacy policy changes on this page.
                  </p>
                </section>
              </div>
            </DialogContent>
          </Dialog>
        </Label>
      </div>
    </div>
  );
};
