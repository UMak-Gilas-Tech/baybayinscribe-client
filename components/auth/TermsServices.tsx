import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  termsOfServiceContent,
  privacyPolicyContent,
} from "./TermsServicesContent";
import { memo } from "react";

interface TermsProps {
  /** The mode of the component - 'required' shows checkbox, 'info' shows only links */
  mode: "required" | "info";
  /** The checked state of the checkbox (only used in required mode) */
  checked?: boolean;
  /** Callback when checkbox state changes (only used in required mode) */
  onCheckedChange?: (checked: boolean) => void;
}

/**
 * Renders a section of the policy content
 */
const PolicySection = memo(
  ({ title, content }: { title: string; content: string }) => {
    const sectionId = `section-${title.toLowerCase().replace(/\s+/g, "-")}`;

    return (
      <section aria-labelledby={sectionId} className="mb-4 last:mb-0">
        <h3 id={sectionId} className="font-semibold mb-2 text-base">
          {title}
        </h3>
        <p className="text-sm leading-relaxed">{content}</p>
      </section>
    );
  }
);

PolicySection.displayName = "PolicySection";

/**
 * Renders the policy content in a dialog
 */
const PolicyDialog = memo(
  ({ content }: { content: typeof termsOfServiceContent }) => {
    return (
      <Dialog>
        <DialogTrigger
          className="text-grey-300 hover:underline hover:text-grey-200 cursor-pointer font-normal focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded-sm transition-colors duration-200 inline-block px-1 py-0.5 -my-0.5 -mx-1"
          aria-label={`Open ${content.title}`}
          aria-haspopup="dialog"
          aria-expanded="false"
        >
          {content.title}
        </DialogTrigger>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4">
              {content.title}
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mb-4">
              Please review our {content.title.toLowerCase()} carefully.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            {content.sections.map((section, index) => (
              <PolicySection key={index} {...section} />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

PolicyDialog.displayName = "PolicyDialog";

/**
 * Renders the required checkbox with label
 */
const RequiredCheckbox = memo(
  ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
  }) => {
    return (
      <div className="inline-block items-start space-x-2 w-full">
        <Checkbox
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="mt-0.5 inline focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors duration-200"
          aria-required="true"
        />
        <Label className="text-sm text-gray-700 inline relative cursor-pointer pl-2">
          I agree to the <PolicyDialog content={termsOfServiceContent} /> &{" "}
          <PolicyDialog content={privacyPolicyContent} />
          <span
            className="absolute text-red-500 -bottom-0 -right-2 text-base xs:text-lg "
            aria-hidden="true"
          >
            *
          </span>
          <span className="sr-only">(required)</span>
        </Label>
      </div>
    );
  }
);

RequiredCheckbox.displayName = "RequiredCheckbox";

/**
 * Renders the info mode label
 */
const InfoLabel = memo(() => (
  <Label className="block w-full mt-1.5 mx-auto text-xs font-light text-grey-200/80 leading-relaxed">
    By continuing, you agree to our{" "}
    <PolicyDialog content={termsOfServiceContent} /> &{" "}
    <PolicyDialog content={privacyPolicyContent} />
  </Label>
));

InfoLabel.displayName = "InfoLabel";

export const TermsServices = memo(
  ({
    mode = "info",
    checked = false,
    onCheckedChange = () => {},
  }: TermsProps) => {
    const isRequired = mode === "required";

    return (
      <div className="flex items-start space-x-2 text-neutral-black w-full max-w-md">
        {isRequired ? (
          <RequiredCheckbox
            checked={checked}
            onCheckedChange={onCheckedChange}
          />
        ) : (
          <InfoLabel />
        )}
      </div>
    );
  }
);

TermsServices.displayName = "TermsServices";
